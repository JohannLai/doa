import {
  ServerRequest,
  getCookies,
  Cookies,
  isIP,
  typeofrequest,
  Accepts,
  parse as contentTypeParse,
} from "./deps.ts";
import { HTTPMethods } from "./types.d.ts";

type Query = { [key: string]: string | string[] };

export class Request {
  #serverRequest: ServerRequest;
  #url: URL;
  #memoizedURL: URL | null = null;

  /**
   * Return request header.
   */
  get header(): Headers {
    return this.#serverRequest.headers;
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

  get url(): string {
    return this.#serverRequest.url;
  }

  set url(val) {
    this.#serverRequest.url = val;
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
    const url = new URL(this.url);
    return url.pathname;
  }

  set path(path: string) {
    const url = new URL(this.url);
    if (url.pathname === path) {
      return;
    }
    url.pathname = path;
    this.#serverRequest.url = `${path}${url.search}`;
  }

  /**
   * Get parsed query-string.
   * Set query-string as an object.
   */
  get query(): Query {
    const query: Query = {};

    for (let [k, v] of new URLSearchParams(this.#url.search) as any) {
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
    const url = new URL(this.url);
    if (url.search.length >= 1) {
      return url.search.slice(1);
    } else {
      return "";
    }
  }

  set querystring(str: string) {
    const url = new URL(this.url);
    if (url.search === `?${str}`) return;
    url.search = `?${str}`;
    this.url = `${url.pathname}?${str}`;
  }

  get search(): string {
    const url = new URL(this.url);
    return url.search;
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
    return this.#serverRequest.headers.get("host");
  }

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  get hostname() {
    const host = this.host;
    if (!host) return "";
    if ("[" == host[0]) return this.#url.hostname || "";
    return host.split(":", 1)[0];
  }

  /**
   * Get WHATWG parsed URL object.
   */
  get URL(): URL | null {
    if (this.#memoizedURL == undefined) {
      try {
        this.#memoizedURL = new URL(this.href);
      } catch (err) {
        this.#memoizedURL = null;
      }
    }
    return this.#memoizedURL;
  }

  /**
  * Check if the request is fresh, aka
  * Last-Modified and/or the ETag
  * still match.
  * @todo write fresh function
  */
  get fresh() {
    // write me
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

  get originalUrl(): string {
    return this.url;
  }

  get cookies(): Cookies {
    return getCookies(this.#serverRequest);
  }

  get protocol(): string {
    return this.#url.protocol.split(":")[0];
  }

  /**
   * Return subdomains as an array.
   *
   * Subdomains are the dot-separated parts of the host before the main domain
   * of the app. By default, the domain of the app is assumed to be the last two
   * parts of the host. This can be changed by setting `app.subdomainOffset`.
   *
   * For example, if the domain is "tobi.ferrets.example.com":
   * If `app.subdomainOffset` is not set, this.subdomains is
   * `["ferrets", "tobi"]`.
   * If `app.subdomainOffset` is 3, this.subdomains is `["tobi"]`.
   */
  get subdomains(): string[] {
    let hostname = this.#url.hostname;

    if (!hostname) return [];

    return !isIP(hostname) ? hostname.split(".").reverse() : [hostname];
  }

  /**
   * Short-hand for:
   *
   * this.protocol == 'https'
   */
  get secure(): boolean {
    return this.protocol === "https";
  }

  /**
   * Return request's remote address
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list and return the first one
   * @todo Implement this function.
   */
  get ip(): string {
    // write me
    return "";
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
    // write me
    return [];
  }

  constructor(request: ServerRequest) {
    this.#serverRequest = request;

    const proto = this.#serverRequest.proto.split("/")[0].toLowerCase();
    this.#url = new URL(
      `${proto}://${
        this.#serverRequest.headers.get("host")
      }${this.#serverRequest.url}`,
    );
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
   * Pretty much the same as `this.request.is()`.
   *
   * @param {String|Array} types...
   * @return {String|false}
   * @api public
   */
  public is(types: string | string[]): string | boolean | null {
    var arr = types;

    if (!Array.isArray(types)) {
      arr = new Array(arguments.length);
      for (var i = 0; i < arr.length; i++) {
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

  public accept(): string[] {
    const accept = this.getAccept();
    return accept.types.apply(accept, arguments as any);
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

  public acceptsCharsets(): string[] {
    const accept = this.getAccept();
    return accept.charsets.apply(accept, arguments as any);
  }

  public acceptsEncodings(): string[] {
    const accept = this.getAccept();
    return accept.encodings.apply(accept, arguments as any);
  }

  public acceptsLanguages(): string[] {
    const accept = this.getAccept();
    return accept.languages.apply(accept, arguments as any);
  }

  private getAccept() {
    return new Accepts(this.#serverRequest.headers);
  }

  /**
   * Inspect implementation.
   */
  public inspect() {
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