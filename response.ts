import {
  assert,
  STATUS_TEXT,
  vary,
  encodeUrl,
  contentType,
  is,
  Response as ServerResponse,
} from "./deps.ts";
import { isReader } from "./utils/isReader.ts";
import { statusEmpty } from "./utils/statusEmpty.ts";
import { statusRedirect } from "./utils/statusRedirect.ts";
import { byteLength } from "./utils/byteLength.ts";

export class Response {
  #ServerResponse: ServerResponse;
  #explicitStatus: Boolean = false;

  // get socket(): Deno.Conn {
  //   // @todo
  //   return;
  // }

  /**
   * Get/Set response status code.
   */
  get status(): number {
    return this.#ServerResponse.status || 200;
  }

  set status(code: number) {
    // @todo: headerSent
    this.#explicitStatus = true;
    this.#ServerResponse.status = code;
    if (this.body && statusEmpty[code]) {
      this.body = null;
    }
  }

  /**
   * Get response status message
   */
  get message(): string {
    return STATUS_TEXT.get(this.status) || "";
  }

  set message(msg) {
    // @todo
  }

  /**
   * Get/Set response body.
   */
  get body(): any {
    return this.#ServerResponse.body || null;
  }

  set body(val: any) {
    const original = this.#ServerResponse.body;
    this.#ServerResponse.body = val;

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
    // if (body instanceof Uint8Array) return body.byteLength;
    return byteLength(JSON.stringify(body));
  }

  set length(n) {
    this.set("Content-Length", n);
  }

  /**
   * Check if a header has been written to the socket.
   * @todo to write headerSent function
   */
  get headerSent(): Boolean {
    return false;
  }

  /**
   * Vary on `field`.
   */
  vary(field: string): void {
    if (!this.#ServerResponse.headers) return;

    vary(this.#ServerResponse.headers, field);
  }

  /**
   * Return response header, alias as response.header
   */
  get header(): Headers {
    return this.#ServerResponse.headers ?? new Headers();
  }

  get headers(): Headers {
    return this.header;
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
    if ("back" === url) url = (this as any).ctx.get("Referrer") || alt || "/";
    this.set("Location", encodeUrl(url));

    // status
    if (!statusRedirect[this.status]) this.status = 302;

    // html
    if ((this as any).ctx.accepts(["html"])) {
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
  public is(types: string[]) {
    return is(this.type, types);
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
    if (this.headerSent) return;

    if (2 === arguments.length) {
      if (Array.isArray(val)) {
        val = val.map((v) => typeof v === "string" ? v : String(v));
      } else if (typeof val !== "string") {
        val = String(val);
      }
      this.#ServerResponse.headers?.set(field, val);
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
    return true;
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
    if (!this.#ServerResponse) return;
    const o = this.toJSON();
    o.body = this.body;
    return o;
  }

  public remove(field: string) {
    if (this.#ServerResponse.headers) {
      this.#ServerResponse.headers.delete(field);
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

  constructor(response: ServerResponse) {
    this.#ServerResponse = response;
  }
}
