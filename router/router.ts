const [SKIND, PKIND, AKIND, STAR, SLASH, COLON] = [0, 1, 2, 42, 47, 58];

export class Node {
  label: number;
  prefix: string;
  children: any[];
  path = "";
  func: Function | undefined;
  kind: number;
  map: any;

  constructor(
    prefix = "/",
    children = [],
    kind = SKIND,
    map = Object.create(null),
  ) {
    this.label = prefix.charCodeAt(0);
    this.prefix = prefix;
    this.children = children;
    this.kind = kind;
    this.map = map;
  }

  addChild(n: any) {
    this.children.push(n);
  }

  findChild(c: any, t: number, l: number, e: any, i = 0) {
    for (l = this.children.length; i < l; i++) {
      e = this.children[i];
      if (c === e.label && t === e.kind) {
        return e;
      }
    }
  }

  findChildWithLabel(c: string, l: number, e: any, i = 0) {
    for (l = this.children.length; i < l; i++) {
      e = this.children[i];
      if (c === e.label) {
        return e;
      }
    }
  }

  findChildByKind(t: number, l: number, e: any, i = 0) {
    for (l = this.children.length; i < l; i++) {
      e = this.children[i];
      if (t === e.kind) {
        return e;
      }
    }
  }

  addHandler(method: string, handler: any, pnames: any) {
    this.map[method] = { handler, pnames };
  }

  findHandler(method: string) {
    return this.map[method];
  }
}

export class Router {
  tree: Node;

  constructor() {
    this.tree = new Node();
  }

  public add(method: string, path: string, handler: any) {
    let ch, j;
    let i = 0;
    let l = path.length;

    // Pnames: Param names
    let pnames: string[] = [];

    for (; i < l; ++i) {
      ch = path.charCodeAt(i);
      if (ch === COLON) {
        j = i + 1;

        this.insert(method, path.substring(0, i), SKIND);
        while (i < l && path.charCodeAt(i) !== SLASH) {
          i++;
        }

        pnames.push(path.substring(j, i));
        path = path.substring(0, j) + path.substring(i);
        i = j;
        l = path.length;

        if (i === l) {
          this.insert(method, path.substring(0, i), PKIND, pnames, handler);
          return;
        }
        this.insert(method, path.substring(0, i), PKIND, pnames);
      } else if (ch === STAR) {
        this.insert(method, path.substring(0, i), SKIND);
        pnames.push("*");
        this.insert(method, path.substring(0, l), AKIND, pnames, handler);
        return;
      }
    }
    this.insert(method, path, SKIND, pnames, handler);
  }

  public insert(
    method: string,
    path: string,
    t: number,
    pnames?: string[],
    handler?: any,
  ) {
    // Current node as root
    let [cn, prefix, sl, pl, l, max, n, c] = [this.tree] as any;

    while (true) {
      prefix = cn.prefix;
      sl = path.length;
      pl = prefix.length;
      l = 0;

      // LCP
      max = sl < pl ? sl : pl;
      while (l < max && path.charCodeAt(l) === prefix.charCodeAt(l)) {
        l++;
      }

      if (l < pl) {
        // Split node
        n = new Node(prefix.substring(l), cn.children, cn.kind, cn.map);
        cn.children = [n]; // Add to parent

        // Reset parent node
        cn.label = prefix.charCodeAt(0);
        cn.prefix = prefix.substring(0, l);
        cn.map = Object.create(null);
        cn.kind = SKIND;

        if (l === sl) {
          // At parent node
          cn.addHandler(method, handler, pnames);
          cn.kind = t;
        } else {
          // Create child node
          n = new Node(path.substring(l), [], t);
          n.addHandler(method, handler, pnames);
          cn.addChild(n);
        }
      } else if (l < sl) {
        path = path.substring(l);
        c = cn.findChildWithLabel(path.charCodeAt(0));
        if (c !== undefined) {
          // Go deeper
          cn = c;
          continue;
        }
        // Create child node
        n = new Node(path, [], t);
        n.addHandler(method, handler, pnames);
        cn.addChild(n);
      } else if (handler !== undefined) {
        // Node already exists
        cn.addHandler(method, handler, pnames);
      }
      return;
    }
  }

  public find(
    method: string,
    path: string,
    cn?: any,
    n = 0,
    result: any = [undefined, []],
  ) {
    cn = cn || this.tree; // Current node as root
    const sl = path.length;
    const prefix = cn.prefix;
    const pvalues: any[] = result[1]; // Params
    let i, pl, l, max, c;
    let preSearch; // Pre search

    // Search order static > param > match-any
    if (sl === 0 || path === prefix) {
      // Found
      const r = cn.findHandler(method);
      if ((result[0] = r && r.handler) !== undefined) {
        const pnames = r.pnames;
        if (pnames !== undefined) {
          for (i = 0, l = pnames.length; i < l; ++i) {
            pvalues[i] = {
              name: pnames[i],
              value: pvalues[i],
            };
          }
        }
      }
      return result;
    }

    pl = prefix.length;
    l = 0;

    // LCP
    max = sl < pl ? sl : pl;
    while (l < max && path.charCodeAt(l) === prefix.charCodeAt(l)) {
      l++;
    }

    if (l === pl) {
      path = path.substring(l);
    }
    preSearch = path;

    // Static node
    c = cn.findChild(path.charCodeAt(0), SKIND);
    if (c !== undefined) {
      this.find(method, path, c, n, result);
      if (result[0] !== undefined) {
        return result;
      }
      path = preSearch;
    }

    // Not found node
    if (l !== pl) {
      return result;
    }

    // Param node
    c = cn.findChildByKind(PKIND);
    if (c !== undefined) {
      l = path.length;
      i = 0;
      while (i < l && path.charCodeAt(i) !== SLASH) {
        i++;
      }

      pvalues[n] = path.substring(0, i);

      n++;
      preSearch = path;
      path = path.substring(i);

      this.find(method, path, c, n, result);
      if (result[0] !== undefined) {
        return result;
      }

      n--;
      pvalues.pop();
      path = preSearch;
    }

    // Any node
    c = cn.findChildByKind(AKIND);
    if (c !== undefined) {
      pvalues[n] = path;
      path = ""; // End search
      this.find(method, path, c, n, result);
    }

    return result;
  }
}
