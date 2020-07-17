import {
  ServerRequest,
  getCookies,
  Cookies,
  Accepts,
  parse as contentTypeParse,
} from "./deps.ts";
import { typeofrequest } from "./utils/typeIs.ts";
import { HTTPMethods } from "./types.d.ts";

type Query = { [key: string]: string | string[] };

export class Request {
  #serverRequest: ServerRequest;
  #url?: URL;
  #proxy: boolean;
  #secure: boolean;
  #accept: Accepts;

  originalUrl: string;
  req: ServerRequest;

  constructor(request: ServerRequest, proxy = false, secure = false) {
    this.#serverRequest = this.req = request;
    this.#proxy = proxy;
    this.#secure = secure;
    this.#accept = new Accepts(this.#serverRequest.headers);

    this.originalUrl = this.#serverRequest.url;

    let proto: string;
    let host: string;

    if (this.#proxy) {
      proto = this.#serverRequest
        .headers.get("x-forwarded-proto")?.split(/\s*,\s*/, 1)[0] ??
        "http";
      host = this.#serverRequest.headers.get("x-forwarded-host") ??
        this.#serverRequest.headers.get("host") ?? "";
    } else {
      proto = this.#secure ? "https" : "http";
      host = this.#serverRequest.headers.get("host") ?? "";
    }
  }

  get hasBody(): boolean {
    return (
      this.headers.get("transfer-encoding") !== null ||
      !!parseInt(this.headers.get("content-length") ?? "")
    );
  }

  /**
   * Return request header.
   */
  get header(): Headers {
    return this.#serverRequest.headers;
  }

  set header(val) {
    this.#serverRequest.headers = val;
  }

  /**
   * Return request header, alias as request.header
   */
  get headers(): Headers {
    return this.#serverRequest.headers;
  }

  set headers(val: Headers) {
    this.#serverRequest.headers = val;
  }

  get url() {
    return this.#serverRequest.url;
  }

  set url(val: string) {
    this.#serverRequest.url = val;
  }

  /**
   * Get WHATWG parsed URL object.
   */
  get URL(): URL {
    if (!this.#url) {
      const serverRequest = this.#serverRequest;
      let proto: string;
      let host: string;
      if (this.#proxy) {
        proto = serverRequest
          .headers.get("x-forwarded-proto")?.split(/\s*,\s*/, 1)[0] ??
          "http";
        host = serverRequest.headers.get("x-forwarded-host") ??
          serverRequest.headers.get("host") ?? "";
      } else {
        proto = this.#secure ? "https" : "http";
        host = serverRequest.headers.get("host") ?? "";
      }

      this.#url = new URL(`${proto}://${host}${serverRequest.url}`);
    }

    return this.#url;
  }

  /**
   * Get origin of URL.
   */
  get origin(): string {
    return `${this.protocol}://${this.host}`;
  }

  /**
   * Get full request URL.
   */
  get href(): string {
    if (/^https?:\/\//i.test(this.originalUrl)) return this.originalUrl;
    return this.origin + this.originalUrl;
  }

  /**
   * Get/Set request method.
   */
  get method(): HTTPMethods {
    return this.#serverRequest.method as HTTPMethods;
  }

  set method(val: HTTPMethods) {
    this.#serverRequest.method = val;
  }

  /**
   * Get request pathname.
   * Set pathname, retaining the query-string when present.
   */
  get path(): string {
    return this.URL.pathname;
  }

  set path(path: string) {
    if (this.URL.pathname === path) {
      return;
    }
    this.URL.pathname = path;
    this.#serverRequest.url = `${path}${this.URL.search}`;
  }

  /**
   * Get parsed query-string.
   * Set query-string as an object.
   */
  get query(): Query {
    const query: Query = {};

    for (let [k, v] of new URLSearchParams(this.URL.search) as any) {
      if (Array.isArray(query[k])) {
        query[k] = [...query[k], v];
      } else if (typeof query[k] === "string") {
        query[k] = [query[k], v];
      } else {
        query[k] = v;
      }
    }

    return query;
  }

  get querystring(): string {
    if (!(this as any).req) return "";
    if (this.URL.search.length >= 1) {
      return this.URL.search.slice(1);
    } else {
      return "";
    }
  }

  set querystring(str: string) {
    if (this.URL.search === `?${str}`) return;
    this.URL.search = `?${str}`;
    this.url = `${this.URL.pathname}?${str}`;
  }

  get search(): string {
    return this.URL.search;
  }

  set search(str: string) {
    this.querystring = str;
  }

  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  get host(): string | null {
    let host = this.#proxy && this.get("X-Forwarded-Host");
    if (!host) host = this.get("Host");
    if (!host) return "";
    return host.split(/\s*,\s*/, 1)[0];
  }

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  get hostname() {
    const host = this.host;
    if (!host) return "";

    if ("[" === host[0]) {
      return this.URL.hostname || "";
    }

    return host.split(":", 1)[0];
  }

  /**
  * Check if the request is fresh, aka
  * Last-Modified and/or the ETag
  * still match.
  * @todo write fresh function
  */
  get fresh() {
    // TODO: write fresh method
    return false;
  }

  /**
   * Check if the request is stale, aka
   * "Last-Modified" and / or the "ETag" for the
   * resource has changed.
   */
  get stale() {
    return this.fresh;
  }

  /**
   * Check if the request is idempotent.
   */
  get idempotent(): boolean {
    const methods = ["GET", "HEAD", "PUT", "DELETE", "OPTIONS", "TRACE"];
    return !!~methods.indexOf(this.method);
  }

  /**
   * Return the request conn.
   */
  get socket(): Deno.Conn {
    return this.#serverRequest.conn;
  }

  get cookies(): Cookies {
    return getCookies(this.#serverRequest);
  }

  get protocol(): string {
    return this.URL.protocol.split(":")[0];
  }

  /**
   * Short-hand for:
   *
   * this.protocol == 'https'
   */
  get secure(): boolean {
    return this.#secure;
  }

  /**
   * Return request's remote address
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list and return the first one
   * @todo Implement this function.
   */
  get ip(): string {
    return this.#proxy
      ? this.ips[0]
      : (this.#serverRequest.conn.remoteAddr as Deno.NetAddr).hostname;
  }

  /**
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list.
   *
   * For example if the value were "client, proxy1, proxy2"
   * you would receive the array `["client", "proxy1", "proxy2"]`
   * where "proxy2" is the furthest down-stream.
   * @todo Implement this function.
   */
  get ips(): string[] {
    return this.#proxy
      ? (this.#serverRequest.headers.get("x-forwarded-for") ??
        (this.#serverRequest.conn.remoteAddr as Deno.NetAddr).hostname).split(
          /\s*,\s*/,
        )
      : [];
  }

  /**
   * Return request header. If the header is not set, will return an empty
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
    switch (field = field.toLowerCase()) {
      case "referer":
      case "referrer":
        return this.#serverRequest.headers.get("referrer") ||
          this.#serverRequest.headers.get("referer") || "";
      default:
        return this.#serverRequest.headers.get(field) || "";
    }
  }

  /**
   * Check whether the response is one of the listed types.
   *
   * @param {String|Array} types...
   * @return {String|false}
   * @api public
   */
  public is(types: string | string[]): string | boolean | null {
    let arr = types;

    if (!Array.isArray(types)) {
      arr = new Array(arguments.length);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arguments[i];
      }
    }

    return typeofrequest(this.#serverRequest.headers, arr as string[]);
  }

  /**
   * Return the request mime type void of
   * parameters such as "charset".
   */
  get type(): string {
    const type = this.get("Content-Type");
    if (!type) return "";
    return type.split(";")[0];
  }

  public xhr(): Boolean {
    const val = this.get("X-Requested-With") || "";

    return val.toLowerCase() === "xmlhttprequest";
  }

  /**
   * Get the charset when present or empty.
   */
  get charset(): string {
    try {
      const { parameters } = contentTypeParse(this.get("Content-Type"));
      return (parameters && parameters.charset) || "";
    } catch (e) {
      return "";
    }
  }

  /**
   * Return parsed Content-Length when present.
   */
  get length(): number | undefined {
    const len = this.get("Content-Length");
    if (len == "") return;
    return ~~len;
  }

  accepts(): string[] | undefined | boolean;
  accepts(...types: string[]): string | string[] | undefined | boolean {
    types = Array.isArray(types[0]) ? types[0] : types;

    const res = this.accept.types(types);

    if (res.length === 0) {
      return false;
    }

    if (res.length === 1 && !!types.length) {
      return res[0];
    }

    return res;
  }
  acceptsCharsets(): string[] | undefined | boolean;
  acceptsCharsets(...types: string[]): string | string[] | undefined | boolean {
    types = Array.isArray(types[0]) ? types[0] : types;

    const res = this.accept.charsets(types);

    if (res.length === 0) {
      return false;
    }

    if (res.length === 1 && !!types.length) {
      return res[0];
    }

    return res;
  }

  acceptsEncodings(
    ...types: string[]
  ): string | string[] | undefined | boolean {
    types = Array.isArray(types[0]) ? types[0] : types;

    const res = this.accept.encodings(types);

    if (res.length === 0) {
      return false;
    }

    if (res.length === 1 && !!types.length) {
      return res[0];
    }

    return res;
  }

  acceptsLanguages(
    ...types: string[]
  ): string | string[] | undefined | boolean {
    types = Array.isArray(types[0]) ? types[0] : types;

    const res = this.accept.languages(types);

    if (res.length === 0) {
      return false;
    }

    if (res.length === 1 && !!types.length) {
      return res[0];
    }

    return res;
  }

  get accept() {
    return this.#accept ||
      (this.#accept = new Accepts(this.#serverRequest.headers));
  }

  set accept(obj) {
    this.#accept = obj;
  }

  /**
   * Inspect implementation.
   */
  inspect() {
    if (!this.#serverRequest) return;
    return this.toJSON();
  }

  /**
   * Return JSON representation.
   */
  public toJSON() {
    return [
      this.method,
      this.url,
      this.header,
    ];
  }
}
