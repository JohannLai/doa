import type { App } from "../app.ts";
import type {
  ServerRequest,
  Response as ServerResponse,
  Accepts,
  Props,
} from "../deps.ts";
import * as compose from "../compose.ts";

export interface ContextDelegatedRequest {
  /**
   * Return request header.
   */
  header: any;

  /**
   * Return request header, alias as request.header
   */
  headers: any;

  /**
   * Get/Set request URL.
   */
  url: string;

  /**
   * Get origin of URL.
   */
  origin: string;

  /**
   * Get full request URL.
   */
  href: string;

  /**
   * Get/Set request method.
   */
  method: string;

  /**
   * Get request pathname.
   * Set pathname, retaining the query-string when present.
   */
  path: string;

  /**
   * Get parsed query-string.
   * Set query-string as an object.
   */
  query: any;

  /**
     * Get/Set query string.
     */
  querystring: string;

  /**
     * Get the search string. Same as the querystring
     * except it includes the leading ?.
     *
     * Set the search string. Same as
     * response.querystring= but included for ubiquity.
     */
  search: string;

  /**
     * Parse the "Host" header field host
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
  host: string;

  /**
     * Parse the "Host" header field hostname
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
  hostname: string;

  /**
     * Get WHATWG parsed URL object.
     */
  URL: URL | null;

  /**
     * Check if the request is fresh, aka
     * Last-Modified and/or the ETag
     * still match.
     */
  fresh: boolean;

  /**
     * Check if the request is stale, aka
     * "Last-Modified" and / or the "ETag" for the
     * resource has changed.
     */
  stale: boolean;

  /**
   * Check if the request is idempotent.
   */
  idempotent: boolean;

  /**
   * Return the request socket.
   */
  socket: Deno.Conn;

  /**
   * Return the protocol string "http" or "https"
   * when requested with TLS. When the proxy setting
   * is enabled the "X-Forwarded-Proto" header
   * field will be trusted. If you're running behind
   * a reverse proxy that supplies https for you this
   * may be enabled.
   */
  protocol: string;

  /**
   * Short-hand for:
   *
   * this.protocol == 'https'
   */
  secure: boolean;

  /**
   * Request remote address. Supports X-Forwarded-For when app.proxy is true.
   */
  ip: string;

  /**
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list.
   *
   * For example if the value were "client, proxy1, proxy2"
   * you would receive the array `["client", "proxy1", "proxy2"]`
   * where "proxy2" is the furthest down-stream.
   */
  ips: string[];

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
  subdomains: string[];

  // accepts(): string[] | boolean;
  // accepts(...types: string[]): string | boolean;
  accepts(types?: string[]): string[];

  acceptsEncodings(encodings?: string[]): string[];

  acceptsCharsets(charsets?: string[]): string[];

  acceptsLanguages(langs?: string[]): string[];

  /**
     * Check if the incoming request contains the "Content-Type"
     * header field, and it contains any of the give mime `type`s.
     * If there is no request body, `null` is returned.
     * If there is no content type, `false` is returned.
     * Otherwise, it returns the first `type` that matches.
     *
     * Examples:
     *
     *     // With Content-Type: text/html; charset=utf-8
     *     this.is('html'); // => 'html'
     *     this.is('text/html'); // => 'text/html'
     *     this.is('text/*', 'application/json'); // => 'text/html'
     *
     *     // When Content-Type is application/json
     *     this.is('json', 'urlencoded'); // => 'json'
     *     this.is('application/json'); // => 'application/json'
     *     this.is('html', 'application/*'); // => 'application/json'
     *
     *     this.is('html'); // => false
     */
  // is(): string | boolean;
  is(types?: string[]): string | boolean | null;

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
  get(field: string): string;
}

export interface ContextDelegatedResponse {
  /**
   * Get/Set response status code.
   */
  status: number;

  /**
   * Get response status message
   */
  message: string;

  /**
   * Get/Set response body.
   */
  body: any;

  /**
   * Return parsed response Content-Length when present.
   * Set Content-Length field to `n`.
   */
  length: number;

  /**
   * Check if a header has been written to the socket.
   */
  headerSent: boolean;

  /**
   * Vary on `field`.
   */
  vary(field: string): void;

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
  redirect(url: string, alt?: string): void;

  /**
   * Set Content-Disposition to "attachment" to signal the client to prompt for download.
   * Optionally specify the filename of the download and some options.
   */
  // attachment(filename?: string, options?: contentDisposition.Options): void;

  /**
   * Return the response mime type void of
   * parameters such as "charset".
   *
   * Set Content-Type response header with `type` through `mime.lookup()`
   * when it does not contain a charset.
   *
   * Examples:
   *
   *     this.type = '.html';
   *     this.type = 'html';
   *     this.type = 'json';
   *     this.type = 'application/json';
   *     this.type = 'png';
   */
  type: string;

  /**
   * Get the Last-Modified date in Date form, if it exists.
   * Set the Last-Modified date using a string or a Date.
   *
   *     this.response.lastModified = new Date();
   *     this.response.lastModified = '2013-09-13';
   */
  lastModified: Date;

  /**
   * Get/Set the ETag of a response.
   * This will normalize the quotes if necessary.
   *
   *     this.response.etag = 'md5hashsum';
   *     this.response.etag = '"md5hashsum"';
   *     this.response.etag = 'W/"123456789"';
   *
   * @param {String} etag
   * @api public
   */
  etag: string;

  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * Examples:
   *
   *    this.set('Foo', ['bar', 'baz']);
   *    this.set('Accept', 'application/json');
   *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   */
  set(field: { [key: string]: string }): void;
  set(field: string, val: string | string[]): void;

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
  append(field: string, val: string | string[]): void;

  /**
   * Remove header `field`.
   */
  remove(field: string): void;

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
  has(field: string): boolean;

  /**
   * Checks if the request is writable.
   * Tests for the existence of the socket
   * as node sometimes does not set it.
   */
  writable: boolean;

  /**
   * Flush any set headers, and begin the body
   */
  flushHeaders(): void;
}

export type DefaultStateExtends = any;
/**
 * This interface can be augmented by users to add types to Koa's default state
 */
export interface DefaultState extends DefaultStateExtends {}

export type DefaultContextExtends = {};
/**
 * This interface can be augmented by users to add types to Koa's default context
 */
export interface DefaultContext extends DefaultContextExtends {
  /**
   * Custom properties.
   */
  [key: string]: any;
}

export type Middleware<
  StateT = DefaultState,
  CustomT = DefaultContext,
> = compose.Middleware<ParameterizedContext<StateT, CustomT>>;

export interface BaseRequest extends ContextDelegatedRequest {
  /**
   * Get the charset when present or undefined.
   */
  charset: string;

  /**
   * Return parsed Content-Length when present.
   */
  length: number | undefined;

  /**
   * Return the request mime type void of
   * parameters such as "charset".
   */
  type: string;

  /**
   * Inspect implementation.
   */
  inspect(): any;

  /**
   * Return JSON representation.
   */
  toJSON(): any;
}

export interface BaseResponse extends ContextDelegatedResponse {
  /**
   * Return the request socket.
   *
   * @return {Connection}
   * @api public
   */
  socket: Deno.Conn;

  /**
     * Return response header.
     */
  header: any;

  /**
   * Return response header, alias as response.header
   */
  headers: any;

  /**
   * Check whether the response is one of the listed types.
   * Pretty much the same as `this.request.is()`.
   *
   * @param {String|Array} types...
   * @return {String|false}
   * @api public
   */
  is(): string;
  is(...types: string[]): string;
  is(types: string[]): string;

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
  get(field: string): string;

  /**
   * Inspect implementation.
   */
  inspect(): any;

  /**
   * Return JSON representation.
   */
  toJSON(): any;
}

export interface ProtoContext {
  /**
   * util.inspect() implementation, which
   * just returns the JSON output.
   */
  inspect(): any;

  /**
   * Return JSON representation.
   *
   * Here we explicitly invoke .toJSON() on each
   * object, as iteration will otherwise fail due
   * to the getters and cause utilities such as
   * clone() to fail.
   */
  toJSON(): any;

  /**
   * Similar to .throw(), adds assertion.
   *
   *    this.assert(this.user, 401, 'Please login!');
   *
   * See: https://github.com/jshttp/http-assert
   */
  // assert: typeof httpAssert;

  /**
   * Throw an error with `msg` and optional `status`
   * defaulting to 500. Note that these are user-level
   * errors, and the message may be exposed to the client.
   *
   *    this.throw(403)
   *    this.throw(400, 'name required')
   *    this.throw(400, 'name required', {text: "error"})
   *
   * See: https://deno.land/x/http_errors
   */
  throw(status: number, message?: string, props?: Props): never;
  throw(status: number, props: Props): never;

  /**
   * Default error handling.
   */
  onerror(err: Error): void;
}

export interface BaseContext
  extends ProtoContext, ContextDelegatedRequest, ContextDelegatedResponse {
}

export interface Request extends BaseRequest {
  app: IApplication;
  req: ServerRequest;
  res: ServerResponse;
  ctx: Context;
  response: Response;
  originalUrl: string;
  ip: string;
  accept: Accepts;
}

export interface Response extends BaseResponse {
  app: IApplication;
  req: ServerRequest;
  res: ServerResponse;
  ctx: Context;
  request: Request;
  _explicitNullBody: boolean | undefined;
}

export interface ExtendableContext extends BaseContext {
  app: IApplication;
  request: Request;
  response: Response;
  req: ServerRequest;
  res: ServerResponse;
  originalUrl: string;
  // cookies: Cookies;
  // accept: accepts.Accepts;
  /**
   * To bypass Koa's built-in response handling, you may explicitly set `ctx.respond = false;`
   */
  respond?: boolean;
}

export type ParameterizedContext<
  StateT = DefaultState,
  CustomT = DefaultContext,
> = ExtendableContext & {
  state: StateT;
} & CustomT;

export interface Context extends ParameterizedContext {}

export type Next = () => Promise<any>;

export type IApplication = App;
