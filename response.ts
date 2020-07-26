import {
  assert,
  STATUS_TEXT,
  vary,
  encodeUrl,
  contentType,
  Response as ServerResponse,
} from "./deps.ts";
import { Request } from "./request.ts";
import { is } from "./utils/typeIs.ts";
import { isReader } from "./utils/isReader.ts";
import { statusEmpty } from "./utils/statusEmpty.ts";
import { statusRedirect } from "./utils/statusRedirect.ts";
import { byteLength } from "./utils/byteLength.ts";
import { escape } from "./utils/escape.ts";

export class Response {
  [key: string]: any

  #request: Request;
  #serverResponse: ServerResponse;
  #explicitStatus: Boolean = false;
  #writable = true;

  constructor(request: Request) {
    this.#request = request;
    this.#serverResponse = this.res = {
      headers: new Headers(),
    };
  }

  // @todo
  // get socket(): WebSocket | undefined {
  //   return this.#socket;
  // }

  /**
   * Get/Set response status code.
   */
  get status(): number {
    return this.#serverResponse.status || 200;
  }

  set status(code: number) {
    if (!this.#writable) {
      throw new Error("The response is not writable.");
    }

    this.#explicitStatus = true;
    this.#serverResponse.status = code;
    if (this.body && statusEmpty[code]) {
      this.body = null;
    }
  }

  /**
   * Get response status message
   */
  get message(): string {
    return this.res.statusMessage || STATUS_TEXT.get(this.status) || "";
  }

  set message(msg) {
    this.res.statusMessage = msg;
  }

  /**
   * Get/Set response body.
   */
  get body(): any {
    return this.#serverResponse.body || null;
  }

  set body(val: any) {
    if (!this.#writable) {
      throw new Error("The response is not writable.");
    }

    const original = this.#serverResponse.body;
    this.#serverResponse.body = val;

    // no content
    if (null == val) {
      if (!statusEmpty[this.status]) this.status = 204;
      // if (val === null) (this as any)._explicitNullBody = true;
      this.remove("Content-Type");
      this.remove("Content-Length");
      this.remove("Transfer-Encoding");
      return;
    }

    // set the status
    if (!this.#explicitStatus) {
      this.status = 200;
    } // set the content-type only if not yet set

    const setType = !this.has("Content-Type");

    // string
    if ("string" === typeof val) {
      if (setType) this.type = /^\s*</.test(val) ? "html" : "text";
      this.length = byteLength(val);
      return;
    }

    // buffer
    if (val instanceof Uint8Array) {
      if (setType) this.type = "bin";
      this.length = val.byteLength;
      return;
    }

    // Reader
    if (isReader(val)) {
      if (original != val) {
        // overwriting
        if (null != original) this.remove("Content-Length");
      }
      if (setType) this.type = "bin";
      return;
    }

    // json
    this.remove("Content-Length");
    this.type = "json";
  }

  /**
   * Return parsed response Content-Length when present.
   * Set Content-Length field to `n`.
   */
  get length() {
    if (this.has("Content-Length")) {
      return parseInt(this.get("Content-Length"), 10) || 0;
    }

    const { body } = this;
    if (!body || isReader(body)) return undefined;
    if ("string" === typeof body) return byteLength(body);
    if (body instanceof Uint8Array) return body.byteLength;
    return byteLength(JSON.stringify(body));
  }

  set length(n) {
    this.set("Content-Length", n);
  }

  /**
   * Vary on `field`.
   */
  vary(field: string): void {
    if (!this.#serverResponse.headers) return;

    vary(this.#serverResponse.headers, field);
  }

  /**
   * Return response header, alias as response.header
   */
  get header(): Headers {
    return this.#serverResponse.headers ?? new Headers();
  }

  get headers(): Headers {
    return this.header;
  }

  /** Headers that will be returned in the response. */
  set headers(value: Headers) {
    if (!this.#writable) {
      throw new Error("The response is not writable.");
    }
    this.headers = value;
  }

  /**
   * Perform a 302 redirect to `url`.
   *
   * The string "back" is special-cased
   * to provide Referrer support, when Referrer
   * is not present `alt` or "/" is used.
   *
   * Examples:
   *
   *    this.redirect('back');
   *    this.redirect('back', '/index.html');
   *    this.redirect('/login');
   *    this.redirect('http://google.com');
   */
  redirect(url: string, alt?: string) {
    // location
    if ("back" === url) {
      url = this.#request.get("Referrer") || alt || "/";
    }
    this.set("Location", encodeUrl(url));

    // status
    if (!statusRedirect[this.status]) {
      this.status = 302;
    }// html

    if (this.#request.accepts("html")) {
      url = escape(url);
      this.type = "text/html; charset=utf-8";
      this.body = `Redirecting to <a href="${url}">${url}</a>.`;
      return;
    }

    // text
    this.type = "text/plain; charset=utf-8";
    this.body = `Redirecting to ${url}.`;
  }

  get type(): string {
    const type = this.get("Content-Type");
    if (!type) return "";
    return type.split(";", 1)[0];
  }

  set type(type: string) {
    if (!this.#writable) {
      throw new Error("The response is not writable.");
    }

    if (type) {
      const _type = contentType(type);
      if (_type) {
        this.set("Content-Type", _type);
      } else {
        this.remove("Content-Type");
      }
    } else {
      this.remove("Content-Type");
    }
  }

  /**
   * Get the Last-Modified date in Date form, if it exists.
   * Set the Last-Modified date using a string or a Date.
   *
   *     this.response.lastModified = new Date();
   *     this.response.lastModified = '2013-09-13';
   */
  set lastModified(val: string | Date | undefined) {
    if (val) {
      if ("string" === typeof val) val = new Date(val);
      this.set("Last-Modified", val.toUTCString());
    }
  }

  /**
   * Get the Last-Modified date in Date form, if it exists.
   * Set the Last-Modified date using a string or a Date.
   *
   *     this.response.lastModified = new Date();
   *     this.response.lastModified = '2013-09-13';
   */
  get lastModified() {
    const date = this.get("last-modified");
    if (date) return new Date(date);
  }

  /**
   * Get/Set the ETag of a response.
   * This will normalize the quotes if necessary.
   *
   *     this.response.etag = 'md5hashsum';
   *     this.response.etag = '"md5hashsum"';
   *     this.response.etag = 'W/"123456789"';
   *
   */
  get etag() {
    return this.get("ETag");
  }

  set etag(val: string) {
    if (!/^(W\/)?"/.test(val)) val = `"${val}"`;
    this.set("ETag", val);
  }

  /**
   * Check whether the response is one of the listed types.
   * Pretty much the same as `this.request.is()`.
   */
  public is(...types: string[] | string[][]): string | boolean | null {
    let arr = Array.isArray(types[0]) ? types[0] : types;

    return is(this.type, arr as string[]);
  }

  /**
   * Return response header. If the header is not set, will return an empty
   * string.
   *
   * The `Referrer` header field is special-cased, both `Referrer` and
   * `Referer` are interchangeable.
   *
   * Examples:
   *
   *     this.get('Content-Type');
   *     // => "text/plain"
   *
   *     this.get('content-type');
   *     // => "text/plain"
   *
   *     this.get('Something');
   *     // => ''
   */
  public get(field: string): string {
    return this.header.get(field.toLowerCase()) || "";
  }

  /**
   * Returns true if the header identified by name is currently set in the outgoing headers.
   * The header name matching is case-insensitive.
   *
   * Examples:
   *
   *     this.has('Content-Type');
   *     // => true
   *
   *     this.get('content-type');
   *     // => true
   */
  public has(field: string): boolean {
    return this.header.has(field);
  }

  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * Examples:
   *
   *    this.set('Foo', ['bar', 'baz']);
   *    this.set('Accept', 'application/json');
   *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   *
   */
  set(field: any, val?: any) {
    if (2 === arguments.length) {
      if (Array.isArray(val)) {
        val = val.map((v) => typeof v === "string" ? v : String(v));
      } else if (typeof val !== "string") {
        val = String(val);
      }
      this.#serverResponse.headers?.set(field, val);
    } else {
      for (const key in field) {
        this.set(key, field[key]);
      }
    }
  }

  /**
   * Checks if the request is writable.
   * Tests for the existence of the socket
   * as node sometimes does not set it.
   * @todo write this function
   */
  get writable() {
    return this.#writable;
  }

  /**
   * Set Content-Disposition to "attachment" to signal the client to prompt for download.
   * Optionally specify the filename of the download and some options.
   */
  public attachment(filename?: string, options?: any) {
    // @todo
  }

  /**
   * Append additional header `field` with value `val`.
   *
   * Examples:
   *
   * ```
   * this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
   * this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
   * this.append('Warning', '199 Miscellaneous warning');
   * ```
   */
  public append(field: string, val: string | string[]) {
    const prev = this.get(field);

    if (prev) {
      val = Array.isArray(prev) ? prev.concat(val) : [prev].concat(val);
    }

    return this.set(field, val);
  }

  public inspect() {
    if (!this.#serverResponse) return;
    const o = this.toJSON();
    o.body = this.body;
    return o;
  }

  public remove(field: string) {
    if (this.#serverResponse.headers) {
      this.#serverResponse.headers.delete(field);
    }
  }

  /**
   * Flush any set headers, and begin the body
   * @todo write flushHeaders function
   */
  public flushHeaders(): void {
    // write me
  }

  public toJSON() {
    return {
      status: this.status,
      message: this.message,
      headers: this.headers,
      body: this.body,
    };
  }

  /** Take this response and convert it to the response used by the Deno net
   * server.  Calling this will set the response to not be writable.
   *
   * Most users will have no need to call this method. */
  toServerResponse(): ServerResponse {
    if (this.#serverResponse) {
      return this.#serverResponse;
    }

    // If there is a response type, set the content type header
    if (this.type) {
      const contentTypeString = contentType(this.type);
      if (contentTypeString && !this.headers.has("Content-Type")) {
        this.headers.append("Content-Type", contentTypeString);
      }
    }

    const { headers } = this;

    // If there is no body and no content type and no set length, then set the
    // content length to 0
    if (
      !(
        this.body ||
        headers.has("Content-Type") ||
        headers.has("Content-Length")
      )
    ) {
      headers.append("Content-Length", "0");
    }

    this.#writable = false;
    return this.#serverResponse = {
      status: this.status ?? (this.body ? 200 : 404),
      body: this.body,
      headers,
    };
  }
}
