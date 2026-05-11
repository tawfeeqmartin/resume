typeof BigInt > "u" && (BigInt = function(e) {
  if (isNaN(e)) throw new Error("");
  return e;
});
const re = BigInt(0), de = BigInt(1), Hr = BigInt(2), Ys = BigInt(5), pt = BigInt(10), gy = 2e3, H = {
  s: de,
  n: re,
  d: de
};
function yn(e, t) {
  try {
    e = BigInt(e);
  } catch {
    throw _n();
  }
  return e * t;
}
function Gt(e) {
  return typeof e == "bigint" ? e : Math.floor(e);
}
function Ge(e, t) {
  if (t === re)
    throw Mu();
  const n = Object.create(Le.prototype);
  n.s = e < re ? -de : de, e = e < re ? -e : e;
  const r = zn(e, t);
  return n.n = e / r, n.d = t / r, n;
}
function or(e) {
  const t = {};
  let n = e, r = Hr, i = Ys - de;
  for (; i <= n; ) {
    for (; n % r === re; )
      n /= r, t[r] = (t[r] || re) + de;
    i += de + Hr * r++;
  }
  return n !== e ? n > 1 && (t[n] = (t[n] || re) + de) : t[e] = (t[e] || re) + de, t;
}
const et = function(e, t) {
  let n = re, r = de, i = de;
  if (e != null) if (t !== void 0) {
    if (typeof e == "bigint")
      n = e;
    else {
      if (isNaN(e))
        throw _n();
      if (e % 1 !== 0)
        throw Ja();
      n = BigInt(e);
    }
    if (typeof t == "bigint")
      r = t;
    else {
      if (isNaN(t))
        throw _n();
      if (t % 1 !== 0)
        throw Ja();
      r = BigInt(t);
    }
    i = n * r;
  } else if (typeof e == "object") {
    if ("d" in e && "n" in e)
      n = BigInt(e.n), r = BigInt(e.d), "s" in e && (n *= BigInt(e.s));
    else if (0 in e)
      n = BigInt(e[0]), 1 in e && (r = BigInt(e[1]));
    else if (typeof e == "bigint")
      n = e;
    else
      throw _n();
    i = n * r;
  } else if (typeof e == "number") {
    if (isNaN(e))
      throw _n();
    if (e < 0 && (i = -de, e = -e), e % 1 === 0)
      n = BigInt(e);
    else if (e > 0) {
      let s = 1, u = 0, a = 1, o = 1, f = 1, h = 1e7;
      for (e >= 1 && (s = 10 ** Math.floor(1 + Math.log10(e)), e /= s); a <= h && f <= h; ) {
        let m = (u + o) / (a + f);
        if (e === m) {
          a + f <= h ? (n = u + o, r = a + f) : f > a ? (n = o, r = f) : (n = u, r = a);
          break;
        } else
          e > m ? (u += o, a += f) : (o += u, f += a), a > h ? (n = o, r = f) : (n = u, r = a);
      }
      n = BigInt(n) * BigInt(s), r = BigInt(r);
    }
  } else if (typeof e == "string") {
    let s = 0, u = re, a = re, o = re, f = de, h = de, m = e.replace(/_/g, "").match(/\d+|./g);
    if (m === null)
      throw _n();
    if (m[s] === "-" ? (i = -de, s++) : m[s] === "+" && s++, m.length === s + 1 ? a = yn(m[s++], i) : m[s + 1] === "." || m[s] === "." ? (m[s] !== "." && (u = yn(m[s++], i)), s++, (s + 1 === m.length || m[s + 1] === "(" && m[s + 3] === ")" || m[s + 1] === "'" && m[s + 3] === "'") && (a = yn(m[s], i), f = pt ** BigInt(m[s].length), s++), (m[s] === "(" && m[s + 2] === ")" || m[s] === "'" && m[s + 2] === "'") && (o = yn(m[s + 1], i), h = pt ** BigInt(m[s + 1].length) - de, s += 3)) : m[s + 1] === "/" || m[s + 1] === ":" ? (a = yn(m[s], i), f = yn(m[s + 2], de), s += 3) : m[s + 3] === "/" && m[s + 1] === " " && (u = yn(m[s], i), a = yn(m[s + 2], i), f = yn(m[s + 4], de), s += 5), m.length <= s)
      r = f * h, i = /* void */
      n = o + r * u + h * a;
    else
      throw _n();
  } else if (typeof e == "bigint")
    n = e, i = e, r = de;
  else
    throw _n();
  if (r === re)
    throw Mu();
  H.s = i < re ? -de : de, H.n = n < re ? -n : n, H.d = r < re ? -r : r;
};
function yy(e, t, n) {
  let r = de;
  for (; t > re; e = e * e % n, t >>= de)
    t & de && (r = r * e % n);
  return r;
}
function by(e, t) {
  for (; t % Hr === re; t /= Hr)
    ;
  for (; t % Ys === re; t /= Ys)
    ;
  if (t === de)
    return re;
  let n = pt % t, r = 1;
  for (; n !== de; r++)
    if (n = n * pt % t, r > gy)
      return re;
  return BigInt(r);
}
function Ay(e, t, n) {
  let r = de, i = yy(pt, n, t);
  for (let s = 0; s < 300; s++) {
    if (r === i)
      return BigInt(s);
    r = r * pt % t, i = i * pt % t;
  }
  return 0;
}
function zn(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  for (; ; ) {
    if (e %= t, !e)
      return t;
    if (t %= e, !t)
      return e;
  }
}
function Le(e, t) {
  if (et(e, t), this instanceof Le)
    e = zn(H.d, H.n), this.s = H.s, this.n = H.n / e, this.d = H.d / e;
  else
    return Ge(H.s * H.n, H.d);
}
var Mu = function() {
  return new Error("Division by Zero");
}, _n = function() {
  return new Error("Invalid argument");
}, Ja = function() {
  return new Error("Parameters must be integer");
};
Le.prototype = {
  s: de,
  n: re,
  d: de,
  /**
   * Calculates the absolute value
   *
   * Ex: new Fraction(-4).abs() => 4
   **/
  abs: function() {
    return Ge(this.n, this.d);
  },
  /**
   * Inverts the sign of the current fraction
   *
   * Ex: new Fraction(-4).neg() => 4
   **/
  neg: function() {
    return Ge(-this.s * this.n, this.d);
  },
  /**
   * Adds two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
   **/
  add: function(e, t) {
    return et(e, t), Ge(
      this.s * this.n * H.d + H.s * this.d * H.n,
      this.d * H.d
    );
  },
  /**
   * Subtracts two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
   **/
  sub: function(e, t) {
    return et(e, t), Ge(
      this.s * this.n * H.d - H.s * this.d * H.n,
      this.d * H.d
    );
  },
  /**
   * Multiplies two rational numbers
   *
   * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
   **/
  mul: function(e, t) {
    return et(e, t), Ge(
      this.s * H.s * this.n * H.n,
      this.d * H.d
    );
  },
  /**
   * Divides two rational numbers
   *
   * Ex: new Fraction("-17.(345)").inverse().div(3)
   **/
  div: function(e, t) {
    return et(e, t), Ge(
      this.s * H.s * this.n * H.d,
      this.d * H.n
    );
  },
  /**
   * Clones the actual object
   *
   * Ex: new Fraction("-17.(345)").clone()
   **/
  clone: function() {
    return Ge(this.s * this.n, this.d);
  },
  /**
   * Calculates the modulo of two rational numbers - a more precise fmod
   *
   * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
   * Ex: new Fraction(20, 10).mod().equals(0) ? "is Integer"
   **/
  mod: function(e, t) {
    if (e === void 0)
      return Ge(this.s * this.n % this.d, de);
    if (et(e, t), re === H.n * this.d)
      throw Mu();
    return Ge(
      this.s * (H.d * this.n) % (H.n * this.d),
      H.d * this.d
    );
  },
  /**
   * Calculates the fractional gcd of two rational numbers
   *
   * Ex: new Fraction(5,8).gcd(3,7) => 1/56
   */
  gcd: function(e, t) {
    return et(e, t), Ge(zn(H.n, this.n) * zn(H.d, this.d), H.d * this.d);
  },
  /**
   * Calculates the fractional lcm of two rational numbers
   *
   * Ex: new Fraction(5,8).lcm(3,7) => 15
   */
  lcm: function(e, t) {
    return et(e, t), H.n === re && this.n === re ? Ge(re, de) : Ge(H.n * this.n, zn(H.n, this.n) * zn(H.d, this.d));
  },
  /**
   * Gets the inverse of the fraction, means numerator and denominator are exchanged
   *
   * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
   **/
  inverse: function() {
    return Ge(this.s * this.d, this.n);
  },
  /**
   * Calculates the fraction to some integer exponent
   *
   * Ex: new Fraction(-1,2).pow(-3) => -8
   */
  pow: function(e, t) {
    if (et(e, t), H.d === de)
      return H.s < re ? Ge((this.s * this.d) ** H.n, this.n ** H.n) : Ge((this.s * this.n) ** H.n, this.d ** H.n);
    if (this.s < re) return null;
    let n = or(this.n), r = or(this.d), i = de, s = de;
    for (let u in n)
      if (u !== "1") {
        if (u === "0") {
          i = re;
          break;
        }
        if (n[u] *= H.n, n[u] % H.d === re)
          n[u] /= H.d;
        else return null;
        i *= BigInt(u) ** n[u];
      }
    for (let u in r)
      if (u !== "1") {
        if (r[u] *= H.n, r[u] % H.d === re)
          r[u] /= H.d;
        else return null;
        s *= BigInt(u) ** r[u];
      }
    return H.s < re ? Ge(s, i) : Ge(i, s);
  },
  /**
   * Calculates the logarithm of a fraction to a given rational base
   *
   * Ex: new Fraction(27, 8).log(9, 4) => 3/2
   */
  log: function(e, t) {
    if (et(e, t), this.s <= re || H.s <= re) return null;
    const n = {}, r = or(H.n), i = or(H.d), s = or(this.n), u = or(this.d);
    for (const f in i)
      r[f] = (r[f] || re) - i[f];
    for (const f in u)
      s[f] = (s[f] || re) - u[f];
    for (const f in r)
      f !== "1" && (n[f] = !0);
    for (const f in s)
      f !== "1" && (n[f] = !0);
    let a = null, o = null;
    for (const f in n) {
      const h = r[f] || re, m = s[f] || re;
      if (h === re) {
        if (m !== re)
          return null;
        continue;
      }
      let p = m, A = h;
      const M = zn(p, A);
      if (p /= M, A /= M, a === null && o === null)
        a = p, o = A;
      else if (p * o !== a * A)
        return null;
    }
    return a !== null && o !== null ? Ge(a, o) : null;
  },
  /**
   * Check if two rational numbers are the same
   *
   * Ex: new Fraction(19.6).equals([98, 5]);
   **/
  equals: function(e, t) {
    return et(e, t), this.s * this.n * H.d === H.s * H.n * this.d;
  },
  /**
   * Check if this rational number is less than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  lt: function(e, t) {
    return et(e, t), this.s * this.n * H.d < H.s * H.n * this.d;
  },
  /**
   * Check if this rational number is less than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  lte: function(e, t) {
    return et(e, t), this.s * this.n * H.d <= H.s * H.n * this.d;
  },
  /**
   * Check if this rational number is greater than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  gt: function(e, t) {
    return et(e, t), this.s * this.n * H.d > H.s * H.n * this.d;
  },
  /**
   * Check if this rational number is greater than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  gte: function(e, t) {
    return et(e, t), this.s * this.n * H.d >= H.s * H.n * this.d;
  },
  /**
   * Compare two rational numbers
   * < 0 iff this < that
   * > 0 iff this > that
   * = 0 iff this = that
   *
   * Ex: new Fraction(19.6).compare([98, 5]);
   **/
  compare: function(e, t) {
    et(e, t);
    let n = this.s * this.n * H.d - H.s * H.n * this.d;
    return (re < n) - (n < re);
  },
  /**
   * Calculates the ceil of a rational number
   *
   * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
   **/
  ceil: function(e) {
    return e = pt ** BigInt(e || 0), Ge(
      Gt(this.s * e * this.n / this.d) + (e * this.n % this.d > re && this.s >= re ? de : re),
      e
    );
  },
  /**
   * Calculates the floor of a rational number
   *
   * Ex: new Fraction('4.(3)').floor() => (4 / 1)
   **/
  floor: function(e) {
    return e = pt ** BigInt(e || 0), Ge(
      Gt(this.s * e * this.n / this.d) - (e * this.n % this.d > re && this.s < re ? de : re),
      e
    );
  },
  /**
   * Rounds a rational numbers
   *
   * Ex: new Fraction('4.(3)').round() => (4 / 1)
   **/
  round: function(e) {
    return e = pt ** BigInt(e || 0), Ge(
      Gt(this.s * e * this.n / this.d) + this.s * ((this.s >= re ? de : re) + Hr * (e * this.n % this.d) > this.d ? de : re),
      e
    );
  },
  /**
    * Rounds a rational number to a multiple of another rational number
    *
    * Ex: new Fraction('0.9').roundTo("1/8") => 7 / 8
    **/
  roundTo: function(e, t) {
    et(e, t);
    const n = this.n * H.d, r = this.d * H.n, i = n % r;
    let s = Gt(n / r);
    return i + i >= r && s++, Ge(this.s * s * H.n, H.d);
  },
  /**
   * Check if two rational numbers are divisible
   *
   * Ex: new Fraction(19.6).divisible(1.5);
   */
  divisible: function(e, t) {
    return et(e, t), !(!(H.n * this.d) || this.n * H.d % (H.n * this.d));
  },
  /**
   * Returns a decimal representation of the fraction
   *
   * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
   **/
  valueOf: function() {
    return Number(this.s * this.n) / Number(this.d);
  },
  /**
   * Creates a string representation of a fraction with all digits
   *
   * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
   **/
  toString: function(e) {
    let t = this.n, n = this.d;
    e = e || 15;
    let r = by(t, n), i = Ay(t, n, r), s = this.s < re ? "-" : "";
    if (s += Gt(t / n), t %= n, t *= pt, t && (s += "."), r) {
      for (let u = i; u--; )
        s += Gt(t / n), t %= n, t *= pt;
      s += "(";
      for (let u = r; u--; )
        s += Gt(t / n), t %= n, t *= pt;
      s += ")";
    } else
      for (let u = e; t && u--; )
        s += Gt(t / n), t %= n, t *= pt;
    return s;
  },
  /**
   * Returns a string-fraction representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
   **/
  toFraction: function(e) {
    let t = this.n, n = this.d, r = this.s < re ? "-" : "";
    if (n === de)
      r += t;
    else {
      let i = Gt(t / n);
      e && i > re && (r += i, r += " ", t %= n), r += t, r += "/", r += n;
    }
    return r;
  },
  /**
   * Returns a latex representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
   **/
  toLatex: function(e) {
    let t = this.n, n = this.d, r = this.s < re ? "-" : "";
    if (n === de)
      r += t;
    else {
      let i = Gt(t / n);
      e && i > re && (r += i, t %= n), r += "\\frac{", r += t, r += "}{", r += n, r += "}";
    }
    return r;
  },
  /**
   * Returns an array of continued fraction elements
   *
   * Ex: new Fraction("7/8").toContinued() => [0,1,7]
   */
  toContinued: function() {
    let e = this.n, t = this.d, n = [];
    do {
      n.push(Gt(e / t));
      let r = e % t;
      e = t, t = r;
    } while (e !== de);
    return n;
  },
  simplify: function(e) {
    const t = BigInt(1 / (e || 1e-3) | 0), n = this.abs(), r = n.toContinued();
    for (let i = 1; i < r.length; i++) {
      let s = Ge(r[i - 1], de);
      for (let a = i - 2; a >= 0; a--)
        s = s.inverse().add(r[a]);
      let u = s.sub(n);
      if (u.n * t < u.d)
        return s.mul(this.s);
    }
    return this;
  }
};
const Cu = "strudel.log";
let My = 1e3, Ya, Ua;
function Je(e, t, n = {}) {
  let r = performance.now();
  Ya === e && r - Ua < My || (Ya = e, Ua = r, console.log(`%c${e}`, "background-color: black;color:white;border-radius:15px"), typeof document < "u" && typeof CustomEvent < "u" && document.dispatchEvent(
    new CustomEvent(Cu, {
      detail: {
        message: e,
        type: t,
        data: n
      }
    })
  ));
}
Je.key = Cu;
const Cy = (e) => /^[a-gA-G][#bs]*[0-9]$/.test(e), Un = (e) => /^[a-gA-G][#bsf]*[0-9]?$/.test(e), fc = (e) => {
  if (typeof e != "string")
    return [];
  const [t, n = "", r] = e.match(/^([a-gA-G])([#bsf]*)([0-9]*)$/)?.slice(1) || [];
  return t ? [t, n, r ? Number(r) : void 0] : [];
}, vy = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, Py = { "#": 1, b: -1, s: 1, f: -1 }, Rn = (e, t = 3) => {
  const [n, r, i = t] = fc(e);
  if (!n)
    throw new Error('not a note: "' + e + '"');
  const s = vy[n.toLowerCase()], u = r?.split("").reduce((a, o) => a + Py[o], 0) || 0;
  return (Number(i) + 1) * 12 + s + u;
}, Hn = (e) => Math.pow(2, (e - 69) / 12) * 440, vu = (e) => 12 * Math.log(e / 440) / Math.LN2 + 69, Dy = (e, t) => {
  if (typeof e != "object")
    throw new Error("valueToMidi: expected object value");
  let { freq: n, note: r } = e;
  if (typeof n == "number")
    return vu(n);
  if (typeof r == "string")
    return Rn(r);
  if (typeof r == "number")
    return r;
  if (!t)
    throw new Error("valueToMidi: expected freq or note to be set");
  return t;
}, Fy = (e, t) => (e - t) * 1e3, hc = (e) => Hn(typeof e == "number" ? e : Rn(e)), Ey = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], xy = (e) => {
  const t = Math.floor(e / 12) - 1;
  return Ey[e % 12] + t;
}, St = (e, t) => (e % t + t) % t, pc = (e) => e.reduce((t, n) => t + n) / e.length;
function dc(e, t = 0) {
  return isNaN(Number(e)) ? (Je(`"${e}" is not a number, falling back to ${t}`, "warning"), t) : e;
}
const wy = (e, t) => St(Math.round(dc(e ?? 0, 0)), t), Sy = (e) => {
  let { value: t, context: n } = e, r = t;
  if (typeof r == "object" && !Array.isArray(r) && (r = r.note || r.n || r.value, r === void 0))
    throw new Error(`cannot find a playable note for ${JSON.stringify(t)}`);
  if (typeof r == "number" && n.type !== "frequency")
    r = Hn(e.value);
  else if (typeof r == "number" && n.type === "frequency")
    r = e.value;
  else if (typeof r != "string" || !Un(r))
    throw new Error("not a note: " + JSON.stringify(r));
  return r;
}, mc = (e) => {
  let { value: t, context: n } = e;
  if (typeof t == "object")
    return t.freq ? t.freq : hc(t.note || t.n || t.value);
  if (typeof t == "number" && n.type !== "frequency")
    t = Hn(e.value);
  else if (typeof t == "string" && Un(t))
    t = Hn(Rn(e.value));
  else if (typeof t != "number")
    throw new Error("not a note or frequency: " + t);
  return t;
}, gc = (e, t) => e.slice(t).concat(e.slice(0, t)), yc = (...e) => e.reduce(
  (t, n) => (...r) => t(n(...r)),
  (t) => t
), By = (...e) => yc(...e.reverse()), Ar = (e) => e.filter((t) => t != null), An = (e) => [].concat(...e), cr = (e) => e, _y = (e, t) => e, Pu = (e, t) => Array.from({ length: t - e + 1 }, (n, r) => r + e);
function me(e, t, n = e.length) {
  const r = function i(...s) {
    if (s.length >= n)
      return e.apply(this, s);
    {
      const u = function(...a) {
        return i.apply(this, s.concat(a));
      };
      return t && t(u, s), u;
    }
  };
  return t && t(r, []), r;
}
function Du(e) {
  const t = Number(e);
  if (!isNaN(t))
    return t;
  if (Un(e))
    return Rn(e);
  throw new Error(`cannot parse as numeral: "${e}"`);
}
function Fu(e, t) {
  return (...n) => e(...n.map(t));
}
function At(e) {
  return Fu(e, Du);
}
function bc(e) {
  const t = Number(e);
  if (!isNaN(t))
    return t;
  const n = {
    pi: Math.PI,
    w: 1,
    h: 0.5,
    q: 0.25,
    e: 0.125,
    s: 0.0625,
    t: 1 / 3,
    f: 0.2,
    x: 1 / 6
  }[e];
  if (typeof n < "u")
    return n;
  throw new Error(`cannot parse as fractional: "${e}"`);
}
const ky = (e) => Fu(e, bc), Eu = function(e, t) {
  return [t.slice(0, e), t.slice(e)];
}, xu = (e, t, n) => t.map((r, i) => e(r, n[i])), Ac = function(e) {
  const t = [];
  for (let n = 0; n < e.length - 1; ++n)
    t.push([e[n], e[n + 1]]);
  return t;
}, Zi = (e, t, n) => Math.min(Math.max(e, t), n), Iy = ["Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"], Vy = [
  "Sa",
  "Re",
  "Ga",
  "Ma",
  "Pa",
  "Dha",
  "Ni"
], Ny = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Hb", "H"], Ty = [
  "Ni",
  "Pab",
  "Pa",
  "Voub",
  "Vou",
  "Ga",
  "Dib",
  "Di",
  "Keb",
  "Ke",
  "Zob",
  "Zo"
], Ly = [
  "I",
  "Ro",
  "Ha",
  "Ni",
  "Ho",
  "He",
  "To"
], Ry = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], Gy = (e, t = "letters") => {
  const r = (t === "solfeggio" ? Iy : t === "indian" ? Vy : t === "german" ? Ny : t === "byzantine" ? Ty : t === "japanese" ? Ly : Ry)[e % 12], i = Math.floor(e / 12) - 1;
  return r + i;
};
function Xy(e) {
  var t = {};
  return e.filter(function(n) {
    return t.hasOwn(n) ? !1 : t[n] = !0;
  });
}
function Zy(e) {
  return e.sort().filter(function(t, n, r) {
    return !n || t != r[n - 1];
  });
}
function Mc(e) {
  return e.sort((t, n) => t.compare(n)).filter(function(t, n, r) {
    return !n || t.ne(r[n - 1]);
  });
}
function Cc(e) {
  const t = new TextEncoder().encode(e);
  return btoa(String.fromCharCode(...t));
}
function vc(e) {
  const t = new Uint8Array(
    atob(e).split("").map((r) => r.charCodeAt(0))
  );
  return new TextDecoder().decode(t);
}
function Wy(e) {
  return encodeURIComponent(Cc(e));
}
function Oy(e) {
  return vc(decodeURIComponent(e));
}
function Pc(e, t) {
  return Array.isArray(e) ? e.map(t) : Object.fromEntries(Object.entries(e).map(([n, r], i) => [n, t(r, n, i)]));
}
function Us(e, t) {
  return e / t;
}
class Dc {
  constructor({
    getTargetClockTime: t = jy,
    weight: n = 16,
    offsetDelta: r = 5e-3,
    checkAfterTime: i = 2,
    resetAfterTime: s = 8
  }) {
    this.offsetTime, this.timeAtPrevOffsetSample, this.prevOffsetTimes = [], this.getTargetClockTime = t, this.weight = n, this.offsetDelta = r, this.checkAfterTime = i, this.resetAfterTime = s, this.reset = () => {
      this.prevOffsetTimes = [], this.offsetTime = null, this.timeAtPrevOffsetSample = null;
    };
  }
  calculateOffset(t) {
    const n = this.getTargetClockTime(), r = n - this.timeAtPrevOffsetSample, i = n - t;
    if (r > this.resetAfterTime && this.reset(), this.offsetTime == null && (this.offsetTime = i), this.prevOffsetTimes.push(i), this.prevOffsetTimes.length > this.weight && this.prevOffsetTimes.shift(), this.timeAtPrevOffsetSample == null || r > this.checkAfterTime) {
      this.timeAtPrevOffsetSample = n;
      const s = pc(this.prevOffsetTimes);
      Math.abs(s - this.offsetTime) > this.offsetDelta && (this.offsetTime = s);
    }
    return this.offsetTime;
  }
  calculateTimestamp(t, n) {
    return this.calculateOffset(t) + n;
  }
}
function zy() {
  return performance.now() * 1e-3;
}
function jy() {
  return Date.now() * 1e-3;
}
const Fc = /* @__PURE__ */ new Map([
  ["control", "Control"],
  ["ctrl", "Control"],
  ["alt", "Alt"],
  ["shift", "Shift"],
  ["down", "ArrowDown"],
  ["up", "ArrowUp"],
  ["left", "ArrowLeft"],
  ["right", "ArrowRight"]
]);
let Vr;
function Ec() {
  if (Vr == null) {
    if (typeof window > "u")
      return;
    Vr = {}, window.addEventListener("keydown", (e) => {
      Vr[e.key] = !0;
    }), window.addEventListener("keyup", (e) => {
      Vr[e.key] = !1;
    });
  }
  return { ...Vr };
}
Le.prototype.sam = function() {
  return this.floor();
};
Le.prototype.nextSam = function() {
  return this.sam().add(1);
};
Le.prototype.wholeCycle = function() {
  return new He(this.sam(), this.nextSam());
};
Le.prototype.cyclePos = function() {
  return this.sub(this.sam());
};
Le.prototype.lt = function(e) {
  return this.compare(e) < 0;
};
Le.prototype.gt = function(e) {
  return this.compare(e) > 0;
};
Le.prototype.lte = function(e) {
  return this.compare(e) <= 0;
};
Le.prototype.gte = function(e) {
  return this.compare(e) >= 0;
};
Le.prototype.eq = function(e) {
  return this.compare(e) == 0;
};
Le.prototype.ne = function(e) {
  return this.compare(e) != 0;
};
Le.prototype.max = function(e) {
  return this.gt(e) ? this : e;
};
Le.prototype.maximum = function(...e) {
  return e = e.map((t) => new Le(t)), e.reduce((t, n) => n.max(t), this);
};
Le.prototype.min = function(e) {
  return this.lt(e) ? this : e;
};
Le.prototype.mulmaybe = function(e) {
  return e !== void 0 ? this.mul(e) : void 0;
};
Le.prototype.divmaybe = function(e) {
  return e !== void 0 ? this.div(e) : void 0;
};
Le.prototype.addmaybe = function(e) {
  return e !== void 0 ? this.add(e) : void 0;
};
Le.prototype.submaybe = function(e) {
  return e !== void 0 ? this.sub(e) : void 0;
};
Le.prototype.show = function() {
  return this.s * this.n + "/" + this.d;
};
Le.prototype.or = function(e) {
  return this.eq(0) ? e : this;
};
const j = (e) => Le(e), $y = (...e) => {
  if (e = Ar(e), e.length !== 0)
    return e.reduce((t, n) => t.gcd(n), j(1));
}, Ot = (...e) => {
  if (e = Ar(e), e.length === 0)
    return;
  const t = e.pop();
  return e.reduce(
    (n, r) => n === void 0 || r === void 0 ? void 0 : n.lcm(r),
    t
  );
};
j._original = Le;
class He {
  constructor(t, n) {
    this.begin = j(t), this.end = j(n);
  }
  get spanCycles() {
    const t = [];
    var n = this.begin;
    const r = this.end, i = r.sam();
    if (n.equals(r))
      return [new He(n, r)];
    for (; r.gt(n); ) {
      if (n.sam().equals(i)) {
        t.push(new He(n, this.end));
        break;
      }
      const s = n.nextSam();
      t.push(new He(n, s)), n = s;
    }
    return t;
  }
  get duration() {
    return this.end.sub(this.begin);
  }
  cycleArc() {
    const t = this.begin.cyclePos(), n = t.add(this.duration);
    return new He(t, n);
  }
  withTime(t) {
    return new He(t(this.begin), t(this.end));
  }
  withEnd(t) {
    return new He(this.begin, t(this.end));
  }
  withCycle(t) {
    const n = this.begin.sam(), r = n.add(t(this.begin.sub(n))), i = n.add(t(this.end.sub(n)));
    return new He(r, i);
  }
  intersection(t) {
    const n = this.begin.max(t.begin), r = this.end.min(t.end);
    if (!n.gt(r) && !(n.equals(r) && (n.equals(this.end) && this.begin.lt(this.end) || n.equals(t.end) && t.begin.lt(t.end))))
      return new He(n, r);
  }
  intersection_e(t) {
    const n = this.intersection(t);
    if (n == null)
      throw "TimeSpans do not intersect";
    return n;
  }
  midpoint() {
    return this.begin.add(this.duration.div(j(2)));
  }
  equals(t) {
    return this.begin.equals(t.begin) && this.end.equals(t.end);
  }
  show() {
    return this.begin.show() + " → " + this.end.show();
  }
}
class $e {
  /*
        Event class, representing a value active during the timespan
        'part'. This might be a fragment of an event, in which case the
        timespan will be smaller than the 'whole' timespan, otherwise the
        two timespans will be the same. The 'part' must never extend outside of the
        'whole'. If the event represents a continuously changing value
        then the whole will be returned as None, in which case the given
        value will have been sampled from the point halfway between the
        start and end of the 'part' timespan.
        The context is to store a list of source code locations causing the event.
  
        The word 'Event' is more or less a reserved word in javascript, hence this
        class is named called 'Hap'.
        */
  constructor(t, n, r, i = {}, s = !1) {
    this.whole = t, this.part = n, this.value = r, this.context = i, this.stateful = s, s && console.assert(typeof this.value == "function", "Stateful values must be functions");
  }
  get duration() {
    let t;
    return typeof this.value?.duration == "number" ? t = j(this.value.duration) : t = this.whole.end.sub(this.whole.begin), typeof this.value?.clip == "number" ? t.mul(this.value.clip) : t;
  }
  get endClipped() {
    return this.whole.begin.add(this.duration);
  }
  isActive(t) {
    return this.whole.begin <= t && this.endClipped >= t;
  }
  isInPast(t) {
    return t > this.endClipped;
  }
  isInNearPast(t, n) {
    return n - t <= this.endClipped;
  }
  isInFuture(t) {
    return t < this.whole.begin;
  }
  isInNearFuture(t, n) {
    return n < this.whole.begin && n > this.whole.begin - t;
  }
  isWithinTime(t, n) {
    return this.whole.begin <= n && this.endClipped >= t;
  }
  wholeOrPart() {
    return this.whole ? this.whole : this.part;
  }
  withSpan(t) {
    const n = this.whole ? t(this.whole) : void 0;
    return new $e(n, t(this.part), this.value, this.context);
  }
  withValue(t) {
    return new $e(this.whole, this.part, t(this.value), this.context);
  }
  hasOnset() {
    return this.whole != null && this.whole.begin.equals(this.part.begin);
  }
  hasTag(t) {
    return this.context.tags?.includes(t);
  }
  resolveState(t) {
    if (this.stateful && this.hasOnset()) {
      console.log("stateful");
      const n = this.value, [r, i] = n(t);
      return [r, new $e(this.whole, this.part, i, this.context, !1)];
    }
    return [t, this];
  }
  spanEquals(t) {
    return this.whole == null && t.whole == null || this.whole.equals(t.whole);
  }
  equals(t) {
    return this.spanEquals(t) && this.part.equals(t.part) && // TODO would == be better ??
    this.value === t.value;
  }
  show(t = !1) {
    const n = typeof this.value == "object" ? t ? JSON.stringify(this.value).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(this.value) : this.value;
    var r = "";
    if (this.whole == null)
      r = "~" + this.part.show;
    else {
      var i = this.whole.begin.equals(this.part.begin) && this.whole.end.equals(this.part.end);
      this.whole.begin.equals(this.part.begin) || (r = this.whole.begin.show() + " ⇜ "), i || (r += "("), r += this.part.show(), i || (r += ")"), this.whole.end.equals(this.part.end) || (r += " ⇝ " + this.whole.end.show());
    }
    return "[ " + r + " | " + n + " ]";
  }
  showWhole(t = !1) {
    return `${this.whole == null ? "~" : this.whole.show()}: ${typeof this.value == "object" ? t ? JSON.stringify(this.value).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(this.value) : this.value}`;
  }
  combineContext(t) {
    const n = this;
    return { ...n.context, ...t.context, locations: (n.context.locations || []).concat(t.context.locations || []) };
  }
  setContext(t) {
    return new $e(this.whole, this.part, this.value, t);
  }
  ensureObjectValue() {
    if (typeof this.value != "object")
      throw new Error(
        `expected hap.value to be an object, but got "${this.value}". Hint: append .note() or .s() to the end`,
        "error"
      );
  }
}
class pr {
  constructor(t, n = {}) {
    this.span = t, this.controls = n;
  }
  // Returns new State with different span
  setSpan(t) {
    return new pr(t, this.controls);
  }
  withSpan(t) {
    return this.setSpan(t(this.span));
  }
  // Returns new State with different controls
  setControls(t) {
    return new pr(this.span, t);
  }
}
function qy(e, t, n) {
  if (t?.value !== void 0 && Object.keys(t).length === 1)
    return Je("[warn]: Can't do arithmetic on control pattern."), e;
  const r = Object.keys(e).filter((i) => Object.keys(t).includes(i));
  return Object.assign({}, e, t, Object.fromEntries(r.map((i) => [i, n(e[i], t[i])])));
}
me((e, t) => e * t);
me((e, t) => t.map(e));
function xc(e, t = 60) {
  let n = 0, r = j(0), i = [""], s = "";
  for (; i[0].length < t; ) {
    const u = e.queryArc(n, n + 1), a = u.filter((h) => h.hasOnset()).map((h) => h.duration), o = $y(...a), f = o.inverse();
    i = i.map((h) => h + "|"), s += "|";
    for (let h = 0; h < f; h++) {
      const [m, p] = [r, r.add(o)], A = u.filter((v) => v.whole.begin.lte(m) && v.whole.end.gte(p)), M = A.length - i.length;
      M > 0 && (i = i.concat(Array(M).fill(s))), i = i.map((v, E) => {
        const k = A[E];
        if (k) {
          const G = k.whole.begin.eq(m) ? "" + k.value : "-";
          return v + G;
        }
        return v + ".";
      }), s += ".", r = r.add(o);
    }
    n++;
  }
  return i.join(`
`);
}
let Qs, jt = !0;
const Ky = function(e) {
  jt = !!e;
}, wc = (e) => Qs = e;
let z = class tt {
  /**
   * Create a pattern. As an end user, you will most likely not create a Pattern directly.
   *
   * @param {function} query - The function that maps a `State` to an array of `Hap`.
   * @noAutocomplete
   */
  constructor(t, n = void 0) {
    this.query = t, this._Pattern = !0, this._steps = n;
  }
  get _steps() {
    return this.__steps;
  }
  set _steps(t) {
    this.__steps = t === void 0 ? void 0 : j(t);
  }
  setSteps(t) {
    return this._steps = t, this;
  }
  withSteps(t) {
    return jt ? new tt(this.query, this._steps === void 0 ? void 0 : t(this._steps)) : this;
  }
  get hasSteps() {
    return this._steps !== void 0;
  }
  //////////////////////////////////////////////////////////////////////
  // Haskell-style functor, applicative and monadic operations
  /**
   * Returns a new pattern, with the function applied to the value of
   * each hap. It has the alias `fmap`.
   * @synonyms fmap
   * @param {Function} func to to apply to the value
   * @returns Pattern
   * @example
   * "0 1 2".withValue(v => v + 10).log()
   */
  withValue(t) {
    const n = new tt((r) => this.query(r).map((i) => i.withValue(t)));
    return n._steps = this._steps, n;
  }
  // runs func on query state
  withState(t) {
    return this.withHaps((n, r) => (t(r), n));
  }
  /**
   * see `withValue`
   * @noAutocomplete
   */
  fmap(t) {
    return this.withValue(t);
  }
  /**
   * Assumes 'this' is a pattern of functions, and given a function to
   * resolve wholes, applies a given pattern of values to that
   * pattern of functions.
   * @param {Function} whole_func
   * @param {Function} func
   * @noAutocomplete
   * @returns Pattern
   */
  appWhole(t, n) {
    const r = this, i = function(s) {
      const u = r.query(s), a = n.query(s), o = function(f, h) {
        const m = f.part.intersection(h.part);
        if (m != null)
          return new $e(
            t(f.whole, h.whole),
            m,
            f.value(h.value),
            h.combineContext(f)
          );
      };
      return An(
        u.map((f) => Ar(a.map((h) => o(f, h))))
      );
    };
    return new tt(i);
  }
  /**
   * When this method is called on a pattern of functions, it matches its haps
   * with those in the given pattern of values.  A new pattern is returned, with
   * each matching value applied to the corresponding function.
   *
   * In this `_appBoth` variant, where timespans of the function and value haps
   * are not the same but do intersect, the resulting hap has a timespan of the
   * intersection. This applies to both the part and the whole timespan.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appBoth(t) {
    const n = this, r = function(s, u) {
      if (!(s == null || u == null))
        return s.intersection_e(u);
    }, i = n.appWhole(r, t);
    return jt && (i._steps = Ot(t._steps, n._steps)), i;
  }
  /**
   * As with `appBoth`, but the `whole` timespan is not the intersection,
   * but the timespan from the function of patterns that this method is called
   * on. In practice, this means that the pattern structure, including onsets,
   * are preserved from the pattern of functions (often referred to as the left
   * hand or inner pattern).
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appLeft(t) {
    const n = this, r = function(s) {
      const u = [];
      for (const a of n.query(s)) {
        const o = t.query(s.setSpan(a.wholeOrPart()));
        for (const f of o) {
          const h = a.whole, m = a.part.intersection(f.part);
          if (m) {
            const p = a.value(f.value), A = f.combineContext(a), M = new $e(h, m, p, A);
            u.push(M);
          }
        }
      }
      return u;
    }, i = new tt(r);
    return i._steps = this._steps, i;
  }
  /**
   * As with `appLeft`, but `whole` timespans are instead taken from the
   * pattern of values, i.e. structure is preserved from the right hand/outer
   * pattern.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appRight(t) {
    const n = this, r = function(s) {
      const u = [];
      for (const a of t.query(s)) {
        const o = n.query(s.setSpan(a.wholeOrPart()));
        for (const f of o) {
          const h = a.whole, m = f.part.intersection(a.part);
          if (m) {
            const p = f.value(a.value), A = a.combineContext(f), M = new $e(h, m, p, A);
            u.push(M);
          }
        }
      }
      return u;
    }, i = new tt(r);
    return i._steps = t._steps, i;
  }
  bindWhole(t, n) {
    const r = this, i = function(s) {
      const u = function(o, f) {
        return new $e(
          t(o.whole, f.whole),
          f.part,
          f.value,
          Object.assign({}, o.context, f.context, {
            locations: (o.context.locations || []).concat(f.context.locations || [])
          })
        );
      }, a = function(o) {
        return n(o.value).query(s.setSpan(o.part)).map((f) => u(o, f));
      };
      return An(r.query(s).map((o) => a(o)));
    };
    return new tt(i);
  }
  bind(t) {
    const n = function(r, i) {
      if (!(r == null || i == null))
        return r.intersection_e(i);
    };
    return this.bindWhole(n, t);
  }
  join() {
    return this.bind(cr);
  }
  outerBind(t) {
    return this.bindWhole((n) => n, t).setSteps(this._steps);
  }
  outerJoin() {
    return this.outerBind(cr);
  }
  innerBind(t) {
    return this.bindWhole((n, r) => r, t);
  }
  innerJoin() {
    return this.innerBind(cr);
  }
  // Flatterns patterns of patterns, by retriggering/resetting inner patterns at onsets of outer pattern haps
  resetJoin(t = !1) {
    const n = this;
    return new tt((r) => n.discreteOnly().query(r).map((i) => i.value.late(t ? i.whole.begin : i.whole.begin.cyclePos()).query(r).map(
      (s) => new $e(
        // Supports continuous haps in the inner pattern
        s.whole ? s.whole.intersection(i.whole) : void 0,
        s.part.intersection(i.part),
        s.value
      ).setContext(i.combineContext(s))
    ).filter((s) => s.part)).flat());
  }
  restartJoin() {
    return this.resetJoin(!0);
  }
  // Like the other joins above, joins a pattern of patterns of values, into a flatter
  // pattern of values. In this case it takes whole cycles of the inner pattern to fit each event
  // in the outer pattern.
  squeezeJoin() {
    const t = this;
    function n(r) {
      const i = t.discreteOnly().query(r);
      function s(a) {
        const f = a.value._focusSpan(a.wholeOrPart()).query(r.setSpan(a.part));
        function h(m, p) {
          let A;
          if (p.whole && m.whole && (A = p.whole.intersection(m.whole), !A))
            return;
          const M = p.part.intersection(m.part);
          if (!M)
            return;
          const v = p.combineContext(m);
          return new $e(A, M, p.value, v);
        }
        return f.map((m) => h(a, m));
      }
      return An(i.map(s)).filter((a) => a);
    }
    return new tt(n);
  }
  squeezeBind(t) {
    return this.fmap(t).squeezeJoin();
  }
  polyJoin = function() {
    const t = this;
    return t.fmap((n) => n.extend(t._steps.div(n._steps))).outerJoin();
  };
  polyBind(t) {
    return this.fmap(t).polyJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // Utility methods mainly for internal use
  /**
   * Query haps inside the given time span.
   *
   * @param {Fraction | number} begin from time
   * @param {Fraction | number} end to time
   * @returns Hap[]
   * @example
   * const pattern = sequence('a', ['b', 'c'])
   * const haps = pattern.queryArc(0, 1)
   * console.log(haps)
   * silence
   * @noAutocomplete
   */
  queryArc(t, n, r = {}) {
    try {
      return this.query(new pr(new He(t, n), r));
    } catch (i) {
      return Je(`[query]: ${i.message}`, "error"), [];
    }
  }
  /**
   * Returns a new pattern, with queries split at cycle boundaries. This makes
   * some calculations easier to express, as all haps are then constrained to
   * happen within a cycle.
   * @returns Pattern
   * @noAutocomplete
   */
  splitQueries() {
    const t = this, n = (r) => An(r.span.spanCycles.map((i) => t.query(r.setSpan(i))));
    return new tt(n);
  }
  /**
   * Returns a new pattern, where the given function is applied to the query
   * timespan before passing it to the original pattern.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQuerySpan(t) {
    return new tt((n) => this.query(n.withSpan(t)));
  }
  withQuerySpanMaybe(t) {
    const n = this;
    return new tt((r) => {
      const i = r.withSpan(t);
      return i.span ? n.query(i) : [];
    });
  }
  /**
   * As with `withQuerySpan`, but the function is applied to both the
   * begin and end time of the query timespan.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQueryTime(t) {
    return new tt((n) => this.query(n.withSpan((r) => r.withTime(t))));
  }
  /**
   * Similar to `withQuerySpan`, but the function is applied to the timespans
   * of all haps returned by pattern queries (both `part` timespans, and where
   * present, `whole` timespans).
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHapSpan(t) {
    return new tt((n) => this.query(n).map((r) => r.withSpan(t)));
  }
  /**
   * As with `withHapSpan`, but the function is applied to both the
   * begin and end time of the hap timespans.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withHapTime(t) {
    return this.withHapSpan((n) => n.withTime(t));
  }
  /**
   * Returns a new pattern with the given function applied to the list of haps returned by every query.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHaps(t) {
    const n = new tt((r) => t(this.query(r), r));
    return n._steps = this._steps, n;
  }
  /**
   * As with `withHaps`, but applies the function to every hap, rather than every list of haps.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHap(t) {
    return this.withHaps((n) => n.map(t));
  }
  /**
   * Returns a new pattern with the context field set to every hap set to the given value.
   * @param {*} context
   * @returns Pattern
   * @noAutocomplete
   */
  setContext(t) {
    return this.withHap((n) => n.setContext(t));
  }
  /**
   * Returns a new pattern with the given function applied to the context field of every hap.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withContext(t) {
    const n = this.withHap((r) => r.setContext(t(r.context)));
    return this.__pure !== void 0 && (n.__pure = this.__pure, n.__pure_loc = this.__pure_loc), n;
  }
  /**
   * Returns a new pattern with the context field of every hap set to an empty object.
   * @returns Pattern
   * @noAutocomplete
   */
  stripContext() {
    return this.withHap((t) => t.setContext({}));
  }
  /**
   * Returns a new pattern with the given location information added to the
   * context of every hap.
   * @param {Number} start start offset
   * @param {Number} end end offset
   * @returns Pattern
   * @noAutocomplete
   */
  withLoc(t, n) {
    const r = {
      start: t,
      end: n
    }, i = this.withContext((s) => {
      const u = (s.locations || []).concat([r]);
      return { ...s, locations: u };
    });
    return this.__pure && (i.__pure = this.__pure, i.__pure_loc = r), i;
  }
  /**
   * Returns a new Pattern, which only returns haps that meet the given test.
   * @param {Function} hap_test - a function which returns false for haps to be removed from the pattern
   * @returns Pattern
   * @noAutocomplete
   */
  filterHaps(t) {
    return new tt((n) => this.query(n).filter(t));
  }
  /**
   * As with `filterHaps`, but the function is applied to values
   * inside haps.
   * @param {Function} value_test
   * @returns Pattern
   * @noAutocomplete
   */
  filterValues(t) {
    return new tt((n) => this.query(n).filter((r) => t(r.value))).setSteps(this._steps);
  }
  /**
   * Returns a new pattern, with haps containing undefined values removed from
   * query results.
   * @returns Pattern
   * @noAutocomplete
   */
  removeUndefineds() {
    return this.filterValues((t) => t != null);
  }
  /**
   * Returns a new pattern, with all haps without onsets filtered out. A hap
   * with an onset is one with a `whole` timespan that begins at the same time
   * as its `part` timespan.
   * @returns Pattern
   * @noAutocomplete
   */
  onsetsOnly() {
    return this.filterHaps((t) => t.hasOnset());
  }
  /**
   * Returns a new pattern, with 'continuous' haps (those without 'whole'
   * timespans) removed from query results.
   * @returns Pattern
   * @noAutocomplete
   */
  discreteOnly() {
    return this.filterHaps((t) => t.whole);
  }
  /**
   * Combines adjacent haps with the same value and whole.  Only
   * intended for use in tests.
   * @noAutocomplete
   */
  defragmentHaps() {
    return this.discreteOnly().withHaps((n) => {
      const r = [];
      for (var i = 0; i < n.length; ++i) {
        for (var s = !0, u = n[i]; s; ) {
          const f = JSON.stringify(n[i].value);
          for (var a = !1, o = i + 1; o < n.length; o++) {
            const h = n[o];
            if (u.whole.equals(h.whole)) {
              if (u.part.begin.eq(h.part.end)) {
                if (f === JSON.stringify(h.value)) {
                  u = new $e(u.whole, new He(h.part.begin, u.part.end), u.value), n.splice(o, 1), a = !0;
                  break;
                }
              } else if (h.part.begin.eq(u.part.end) && f == JSON.stringify(h.value)) {
                u = new $e(u.whole, new He(u.part.begin, h.part.end), u.value), n.splice(o, 1), a = !0;
                break;
              }
            }
          }
          s = a;
        }
        r.push(u);
      }
      return r;
    });
  }
  /**
   * Queries the pattern for the first cycle, returning Haps. Mainly of use when
   * debugging a pattern.
   * @param {Boolean} with_context - set to true, otherwise the context field
   * will be stripped from the resulting haps.
   * @returns [Hap]
   * @noAutocomplete
   */
  firstCycle(t = !1) {
    var n = this;
    return t || (n = n.stripContext()), n.query(new pr(new He(j(0), j(1))));
  }
  /**
   * Accessor for a list of values returned by querying the first cycle.
   * @noAutocomplete
   */
  get firstCycleValues() {
    return this.firstCycle().map((t) => t.value);
  }
  /**
   * More human-readable version of the `firstCycleValues` accessor.
   * @noAutocomplete
   */
  get showFirstCycle() {
    return this.firstCycle().map(
      (t) => `${t.value}: ${t.whole.begin.toFraction()} - ${t.whole.end.toFraction()}`
    );
  }
  /**
   * Returns a new pattern, which returns haps sorted in temporal order. Mainly
   * of use when comparing two patterns for equality, in tests.
   * @returns Pattern
   * @noAutocomplete
   */
  sortHapsByPart() {
    return this.withHaps(
      (t) => t.sort(
        (n, r) => n.part.begin.sub(r.part.begin).or(n.part.end.sub(r.part.end)).or(n.whole.begin.sub(r.whole.begin).or(n.whole.end.sub(r.whole.end)))
      )
    );
  }
  asNumber() {
    return this.fmap(Du);
  }
  //////////////////////////////////////////////////////////////////////
  // Operators - see 'make composers' later..
  _opIn(t, n) {
    return this.fmap(n).appLeft(K(t));
  }
  _opOut(t, n) {
    return this.fmap(n).appRight(K(t));
  }
  _opMix(t, n) {
    return this.fmap(n).appBoth(K(t));
  }
  _opSqueeze(t, n) {
    const r = K(t);
    return this.fmap((i) => r.fmap((s) => n(i)(s))).squeezeJoin();
  }
  _opSqueezeOut(t, n) {
    const r = this;
    return K(t).fmap((s) => r.fmap((u) => n(u)(s))).squeezeJoin();
  }
  _opReset(t, n) {
    return K(t).fmap((i) => this.fmap((s) => n(s)(i))).resetJoin();
  }
  _opRestart(t, n) {
    return K(t).fmap((i) => this.fmap((s) => n(s)(i))).restartJoin();
  }
  _opPoly(t, n) {
    const r = K(t);
    return this.fmap((i) => r.fmap((s) => n(s)(i))).polyJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // End-user methods.
  // Those beginning with an underscore (_) are 'patternified',
  // i.e. versions are created without the underscore, that are
  // magically transformed to accept patterns for all their arguments.
  //////////////////////////////////////////////////////////////////////
  // Methods without corresponding toplevel functions
  /**
   * Layers the result of the given function(s). Like `superimpose`, but without the original pattern:
   * @name layer
   * @memberof Pattern
   * @synonyms apply
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
   *   .layer(x=>x.add("0,2"))
   *   .scale('C minor').note()
   */
  layer(...t) {
    return Te(...t.map((n) => n(this)));
  }
  /**
   * Superimposes the result of the given function(s) on top of the original pattern:
   * @name superimpose
   * @memberof Pattern
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
   *   .superimpose(x=>x.add(2))
   *   .scale('C minor').note()
   */
  superimpose(...t) {
    return this.stack(...t.map((n) => n(this)));
  }
  //////////////////////////////////////////////////////////////////////
  // Multi-pattern functions
  stack(...t) {
    return Te(this, ...t);
  }
  sequence(...t) {
    return Bt(this, ...t);
  }
  seq(...t) {
    return Bt(this, ...t);
  }
  cat(...t) {
    return Ic(this, ...t);
  }
  fastcat(...t) {
    return gt(this, ...t);
  }
  slowcat(...t) {
    return Gn(this, ...t);
  }
  //////////////////////////////////////////////////////////////////////
  // Context methods - ones that deal with metadata
  onTrigger(t, n = !0) {
    return this.withHap(
      (r) => r.setContext({
        ...r.context,
        onTrigger: (...i) => {
          r.context.onTrigger?.(...i), t(...i);
        },
        // if dominantTrigger is set to true, the default output (webaudio) will be disabled
        // when using multiple triggers, you cannot flip this flag to false again!
        // example: x.csound('CooLSynth').log() as well as x.log().csound('CooLSynth') should work the same
        dominantTrigger: r.context.dominantTrigger || n
      })
    );
  }
  log(t = (r, i) => `[hap] ${i.showWhole(!0)}`, n = (r, i) => ({ hap: i })) {
    return this.onTrigger((...r) => {
      Je(t(...r), void 0, n(...r));
    }, !1);
  }
  logValues(t = cr) {
    return this.log((n, r) => t(r.value));
  }
  //////////////////////////////////////////////////////////////////////
  // Visualisation
  drawLine() {
    return console.log(xc(this)), this;
  }
};
function Hy(e, t) {
  let n = [];
  return t.forEach((r) => {
    const i = n.findIndex(([s]) => e(r, s));
    i === -1 ? n.push([r]) : n[i].push(r);
  }), n;
}
const Jy = (e, t) => e.spanEquals(t);
z.prototype.collect = function() {
  return this.withHaps(
    (e) => Hy(Jy, e).map((t) => new $e(t[0].whole, t[0].part, t, {}))
  );
};
z.prototype.arpWith = function(e) {
  return this.collect().fmap((t) => K(e(t))).innerJoin().withHap((t) => new $e(t.whole, t.part, t.value.value, t.combineContext(t.value)));
};
z.prototype.arp = function(e) {
  return this.arpWith((t) => e.fmap((n) => t[n % t.length]));
};
function mi(e) {
  return !Array.isArray(e) && typeof e == "object";
}
function Yy(e, t, n) {
  return mi(e) || mi(t) ? (mi(e) || (e = { value: e }), mi(t) || (t = { value: t }), qy(e, t, n)) : n(e, t);
}
(function() {
  const e = {
    set: [(n, r) => r],
    keep: [(n) => n],
    keepif: [(n, r) => r ? n : void 0],
    // numerical functions
    /**
     *
     * Assumes a pattern of numbers. Adds the given number to each item in the pattern.
     * @name add
     * @memberof Pattern
     * @example
     * // Here, the triad 0, 2, 4 is shifted by different amounts
     * n("0 2 4".add("<0 3 4 0>")).scale("C:major")
     * // Without add, the equivalent would be:
     * // n("<[0 2 4] [3 5 7] [4 6 8] [0 2 4]>").scale("C:major")
     * @example
     * // You can also use add with notes:
     * note("c3 e3 g3".add("<0 5 7 0>"))
     * // Behind the scenes, the notes are converted to midi numbers:
     * // note("48 52 55".add("<0 5 7 0>"))
     */
    add: [At((n, r) => n + r)],
    // support string concatenation
    /**
     *
     * Like add, but the given numbers are subtracted.
     * @name sub
     * @memberof Pattern
     * @example
     * n("0 2 4".sub("<0 1 2 3>")).scale("C4:minor")
     * // See add for more information.
     */
    sub: [At((n, r) => n - r)],
    /**
     *
     * Multiplies each number by the given factor.
     * @name mul
     * @memberof Pattern
     * @example
     * "<1 1.5 [1.66, <2 2.33>]>*4".mul(150).freq()
     */
    mul: [At((n, r) => n * r)],
    /**
     *
     * Divides each number by the given factor.
     * @name div
     * @memberof Pattern
     */
    div: [At((n, r) => n / r)],
    mod: [At(St)],
    pow: [At(Math.pow)],
    log2: [At(Math.log2)],
    band: [At((n, r) => n & r)],
    bor: [At((n, r) => n | r)],
    bxor: [At((n, r) => n ^ r)],
    blshift: [At((n, r) => n << r)],
    brshift: [At((n, r) => n >> r)],
    // TODO - force numerical comparison if both look like numbers?
    lt: [(n, r) => n < r],
    gt: [(n, r) => n > r],
    lte: [(n, r) => n <= r],
    gte: [(n, r) => n >= r],
    eq: [(n, r) => n == r],
    eqt: [(n, r) => n === r],
    ne: [(n, r) => n != r],
    net: [(n, r) => n !== r],
    and: [(n, r) => n && r],
    or: [(n, r) => n || r],
    //  bitwise ops
    func: [(n, r) => r(n)]
  }, t = ["In", "Out", "Mix", "Squeeze", "SqueezeOut", "Reset", "Restart", "Poly"];
  for (const [n, [r, i]] of Object.entries(e)) {
    z.prototype["_" + n] = function(s) {
      return this.fmap((u) => r(u, s));
    }, Object.defineProperty(z.prototype, n, {
      // a getter that returns a function, so 'pat' can be
      // accessed by closures that are methods of that function..
      get: function() {
        const s = this, u = (...a) => s[n].in(...a);
        for (const a of t)
          u[a.toLowerCase()] = function(...o) {
            var f = s;
            o = Bt(o), i && (f = i(f), o = i(o));
            var h;
            return n === "keepif" ? (h = f["_op" + a](o, (m) => (p) => r(m, p)), h = h.removeUndefineds()) : h = f["_op" + a](o, (m) => (p) => Yy(m, p, r)), h;
          };
        return u.squeezein = u.squeeze, u;
      }
    });
    for (const s of t)
      z.prototype[s.toLowerCase()] = function(...u) {
        return this.set[s.toLowerCase()](u);
      };
  }
  z.prototype.struct = function(...n) {
    return this.keepif.out(...n);
  }, z.prototype.structAll = function(...n) {
    return this.keep.out(...n);
  }, z.prototype.mask = function(...n) {
    return this.keepif.in(...n);
  }, z.prototype.maskAll = function(...n) {
    return this.keep.in(...n);
  }, z.prototype.reset = function(...n) {
    return this.keepif.reset(...n);
  }, z.prototype.resetAll = function(...n) {
    return this.keep.reset(...n);
  }, z.prototype.restart = function(...n) {
    return this.keepif.restart(...n);
  }, z.prototype.restartAll = function(...n) {
    return this.keep.restart(...n);
  };
})();
const Uy = Te, Qy = Te, e3 = Wi, Mr = (e) => new z(() => [], e), Be = Mr(1), Mt = Mr(0);
function Ye(e) {
  function t(r) {
    return r.span.spanCycles.map((i) => new $e(j(i.begin).wholeCycle(), i, e));
  }
  const n = new z(t, 1);
  return n.__pure = e, n;
}
function wu(e) {
  return e instanceof z || e?._Pattern;
}
function K(e) {
  return wu(e) ? e : Qs && typeof e == "string" ? Qs(e) : Ye(e);
}
function Sc(e) {
  let t = Ye([]);
  for (const n of e)
    t = t.bind((r) => n.fmap((i) => r.concat([i])));
  return t;
}
function Te(...e) {
  e = e.map((r) => Array.isArray(r) ? Bt(...r) : K(r));
  const t = (r) => An(e.map((i) => i.query(r))), n = new z(t);
  return jt && (n._steps = Ot(...e.map((r) => r._steps))), n;
}
function Su(e, t) {
  if (t = t.map((s) => Array.isArray(s) ? Bt(...s) : K(s)), t.length === 0)
    return Be;
  if (t.length === 1)
    return t[0];
  const [n, ...r] = t.map((s) => s._steps), i = jt ? n.maximum(...r) : void 0;
  return Te(...e(i, t));
}
function Bc(...e) {
  return Su(
    (t, n) => n.map((r) => r._steps.eq(t) ? r : dt(r, Mr(t.sub(r._steps)))),
    e
  );
}
function _c(...e) {
  return Su(
    (t, n) => n.map((r) => r._steps.eq(t) ? r : dt(Mr(t.sub(r._steps)), r)),
    e
  );
}
function kc(...e) {
  return Su(
    (t, n) => n.map((r) => {
      if (r._steps.eq(t))
        return r;
      const i = Mr(t.sub(r._steps).div(2));
      return dt(i, r, i);
    }),
    e
  );
}
function t3(e, ...t) {
  const [n, ...r] = t.map((u) => u._steps), i = n.maximum(...r), s = {
    centre: kc,
    left: Bc,
    right: _c,
    expand: Te,
    repeat: (...u) => Wi(...u).steps(i)
  };
  return e.inhabit(s).fmap((u) => u(...t)).innerJoin().setSteps(i);
}
function Gn(...e) {
  if (e = e.map((r) => Array.isArray(r) ? gt(...r) : K(r)), e.length == 1)
    return e[0];
  const t = function(r) {
    const i = r.span, s = St(i.begin.sam(), e.length), u = e[s];
    if (!u)
      return [];
    const a = i.begin.floor().sub(i.begin.div(e.length).floor());
    return u.withHapTime((o) => o.add(a)).query(r.setSpan(i.withTime((o) => o.sub(a))));
  }, n = jt ? Ot(...e.map((r) => r._steps)) : void 0;
  return new z(t).splitQueries().setSteps(n);
}
function Bu(...e) {
  e = e.map(K);
  const t = function(n) {
    const r = Math.floor(n.span.begin) % e.length;
    return e[r]?.query(n) || [];
  };
  return new z(t).splitQueries();
}
function Ic(...e) {
  return Gn(...e);
}
function n3(...e) {
  const t = e.reduce((n, [r]) => n + r, 0);
  return e = e.map(([n, r]) => [n, r.fast(n)]), dt(...e).slow(t);
}
function r3(...e) {
  let t = j(0);
  for (let n of e)
    n.length == 2 && n.unshift(t), t = n[1];
  return Te(
    ...e.map(
      ([n, r, i]) => Ye(K(i)).compress(j(n).div(t), j(r).div(t))
    )
  ).slow(t).innerJoin();
}
function gt(...e) {
  let t = Gn(...e);
  return e.length > 1 && (t = t._fast(e.length), t._steps = e.length), e.length == 1 && e[0].__steps_source && (e._steps = e[0]._steps), t;
}
function Bt(...e) {
  return gt(...e);
}
function Vc(...e) {
  return gt(...e);
}
function eu(e) {
  return Array.isArray(e) ? e.length == 0 ? [Be, 0] : e.length == 1 ? eu(e[0]) : [gt(...e.map((t) => eu(t)[0])), e.length] : [K(e), 1];
}
const i3 = me((e, t) => K(t).mask(e)), s3 = me((e, t) => K(t).struct(e)), u3 = me((e, t) => K(t).superimpose(...e)), a3 = me((e, t) => K(t).withValue(e)), o3 = me((e, t) => K(t).bind(e)), c3 = me((e, t) => K(t).innerBind(e)), l3 = me((e, t) => K(t).outerBind(e)), f3 = me((e, t) => K(t).squeezeBind(e)), h3 = me((e, t) => K(t).stepBind(e)), p3 = me((e, t) => K(t).polyBind(e)), d3 = me((e, t) => K(t).set(e)), m3 = me((e, t) => K(t).keep(e)), g3 = me((e, t) => K(t).keepif(e)), y3 = me((e, t) => K(t).add(e)), b3 = me((e, t) => K(t).sub(e)), A3 = me((e, t) => K(t).mul(e)), M3 = me((e, t) => K(t).div(e)), C3 = me((e, t) => K(t).mod(e)), v3 = me((e, t) => K(t).pow(e)), P3 = me((e, t) => K(t).band(e)), D3 = me((e, t) => K(t).bor(e)), F3 = me((e, t) => K(t).bxor(e)), E3 = me((e, t) => K(t).blshift(e)), x3 = me((e, t) => K(t).brshift(e)), w3 = me((e, t) => K(t).lt(e)), S3 = me((e, t) => K(t).gt(e)), B3 = me((e, t) => K(t).lte(e)), _3 = me((e, t) => K(t).gte(e)), k3 = me((e, t) => K(t).eq(e)), I3 = me((e, t) => K(t).eqt(e)), V3 = me((e, t) => K(t).ne(e)), N3 = me((e, t) => K(t).net(e)), T3 = me((e, t) => K(t).and(e)), L3 = me((e, t) => K(t).or(e)), R3 = me((e, t) => K(t).func(e));
function T(e, t, n = !0, r = !1, i = (s) => s.innerJoin()) {
  if (Array.isArray(e)) {
    const a = {};
    for (const o of e)
      a[o] = T(o, t, n, r, i);
    return a;
  }
  const s = t.length;
  var u;
  return n ? u = function(...a) {
    a = a.map(K);
    const o = a[a.length - 1];
    let f;
    if (s === 1)
      f = t(o);
    else {
      const h = a.slice(0, -1);
      if (h.every((m) => m.__pure != null)) {
        const m = h.map((A) => A.__pure), p = h.filter((A) => A.__pure_loc).map((A) => A.__pure_loc);
        f = t(...m, o), f = f.withContext((A) => {
          const M = (A.locations || []).concat(p);
          return { ...A, locations: M };
        });
      } else {
        const [m, ...p] = h;
        let A = (...M) => t(...M, o);
        A = me(A, null, s - 1), f = i(p.reduce((M, v) => M.appLeft(v), m.fmap(A)));
      }
    }
    return r && (f._steps = o._steps), f;
  } : u = function(...a) {
    a = a.map(K);
    const o = t(...a);
    return r && (o._steps = a[a.length - 1]._steps), o;
  }, z.prototype[e] = function(...a) {
    if (s === 2 && a.length !== 1)
      a = [Bt(...a)];
    else if (s !== a.length + 1)
      throw new Error(`.${e}() expects ${s - 1} inputs but got ${a.length}.`);
    return a = a.map(K), u(...a, this);
  }, s > 1 && (z.prototype["_" + e] = function(...a) {
    const o = t(...a, this);
    return r && o.setSteps(this._steps), o;
  }), me(u, null, s);
}
function ti(e, t, n = !0, r = !1, i = (s) => s.stepJoin()) {
  return T(e, t, n, r, i);
}
const G3 = T("round", function(e) {
  return e.asNumber().fmap((t) => Math.round(t));
}), X3 = T("floor", function(e) {
  return e.asNumber().fmap((t) => Math.floor(t));
}), Z3 = T("ceil", function(e) {
  return e.asNumber().fmap((t) => Math.ceil(t));
}), W3 = T("toBipolar", function(e) {
  return e.fmap((t) => t * 2 - 1);
}), O3 = T("fromBipolar", function(e) {
  return e.fmap((t) => (t + 1) / 2);
}), z3 = T("range", function(e, t, n) {
  return n.mul(t - e).add(e);
}), j3 = T("rangex", function(e, t, n) {
  return n._range(Math.log(e), Math.log(t)).fmap(Math.exp);
}), $3 = T("range2", function(e, t, n) {
  return n.fromBipolar()._range(e, t);
}), q3 = T(
  "ratio",
  (e) => e.fmap((t) => Array.isArray(t) ? t.slice(1).reduce((n, r) => n / r, t[0]) : t)
), K3 = T("compress", function(e, t, n) {
  return e = j(e), t = j(t), e.gt(t) || e.gt(1) || t.gt(1) || e.lt(0) || t.lt(0) ? Be : n._fastGap(j(1).div(t.sub(e)))._late(e);
}), { compressSpan: H3, compressspan: J3 } = T(["compressSpan", "compressspan"], function(e, t) {
  return t._compress(e.begin, e.end);
}), { fastGap: Y3, fastgap: U3 } = T(["fastGap", "fastgap"], function(e, t) {
  const n = function(i) {
    const s = i.begin.sam(), u = i.begin.sub(s).mul(e).min(1), a = i.end.sub(s).mul(e).min(1);
    if (!(u >= 1))
      return new He(s.add(u), s.add(a));
  }, r = function(i) {
    const s = i.part.begin, u = i.part.end, a = s.sam(), o = s.sub(a).div(e).min(1), f = u.sub(a).div(e).min(1), h = new He(a.add(o), a.add(f)), m = i.whole ? new He(
      h.begin.sub(s.sub(i.whole.begin).div(e)),
      h.end.add(i.whole.end.sub(u).div(e))
    ) : void 0;
    return new $e(m, h, i.value, i.context);
  };
  return t.withQuerySpanMaybe(n).withHap(r).splitQueries();
}), Q3 = T("focus", function(e, t, n) {
  return e = j(e), t = j(t), n._early(e.sam())._fast(j(1).div(t.sub(e)))._late(e);
}), { focusSpan: eb, focusspan: tb } = T(["focusSpan", "focusspan"], function(e, t) {
  return t._focus(e.begin, e.end);
}), nb = T("ply", function(e, t) {
  const n = t.fmap((r) => Ye(r)._fast(e)).squeezeJoin();
  return jt && (n._steps = j(e).mulmaybe(t._steps)), n;
}), { fast: rb, density: FF } = T(
  ["fast", "density"],
  function(e, t) {
    return e === 0 ? Be : (e = j(e), t.withQueryTime((r) => r.mul(e)).withHapTime((r) => r.div(e)).setSteps(t._steps));
  },
  !0,
  !0
), ib = T("hurry", function(e, t) {
  return t._fast(e).mul(Ye({ speed: e }));
}), { slow: sb, sparsity: ub } = T(["slow", "sparsity"], function(e, t) {
  return e === 0 ? Be : t._fast(j(1).div(e));
}), ab = T("inside", function(e, t, n) {
  return t(n._slow(e))._fast(e);
}), ob = T("outside", function(e, t, n) {
  return t(n._fast(e))._slow(e);
}), cb = T("lastOf", function(e, t, n) {
  const r = Array(e - 1).fill(n);
  return r.push(t(n)), Bu(...r);
}), { firstOf: lb, every: fb } = T(["firstOf", "every"], function(e, t, n) {
  const r = Array(e - 1).fill(n);
  return r.unshift(t(n)), Bu(...r);
}), hb = T("apply", function(e, t) {
  return e(t);
}), pb = T("cpm", function(e, t) {
  return t._fast(e / 60 / 1);
}), db = T(
  "early",
  function(e, t) {
    return e = j(e), t.withQueryTime((n) => n.add(e)).withHapTime((n) => n.sub(e));
  },
  !0,
  !0
), Nc = T(
  "late",
  function(e, t) {
    return e = j(e), t._early(j(0).sub(e));
  },
  !0,
  !0
), mb = T("zoom", function(e, t, n) {
  if (t = j(t), e = j(e), e.gte(t))
    return Mt;
  const r = t.sub(e), i = jt ? n._steps?.mulmaybe(r) : void 0;
  return n.withQuerySpan((s) => s.withCycle((u) => u.mul(r).add(e))).withHapSpan((s) => s.withCycle((u) => u.sub(e).div(r))).splitQueries().setSteps(i);
}), { zoomArc: gb, zoomarc: yb } = T(["zoomArc", "zoomarc"], function(e, t) {
  return t.zoom(e.begin, e.end);
}), bb = T(
  "bite",
  (e, t, n) => t.fmap((r) => (i) => {
    const s = j(r).div(i).mod(1), u = s.add(j(1).div(i));
    return n.zoom(s, u);
  }).appLeft(e).squeezeJoin(),
  !1
), Ab = T(
  "linger",
  function(e, t) {
    return e == 0 ? Be : e < 0 ? t._zoom(e.add(1), 1)._slow(e) : t._zoom(0, e)._slow(e);
  },
  !0,
  !0
), { segment: Mb, seg: Cb } = T(["segment", "seg"], function(e, t) {
  return t.struct(Ye(!0)._fast(e)).setSteps(e);
}), vb = T("swingBy", (e, t, n) => n.inside(t, Nc(Vc(0, e / 2)))), Pb = T("swing", (e, t) => t.swingBy(1 / 3, e)), { invert: Db, inv: Fb } = T(
  ["invert", "inv"],
  function(e) {
    return e.fmap((t) => !t);
  },
  !0,
  !0
), Eb = T("when", function(e, t, n) {
  return e ? t(n) : n;
}), xb = T("off", function(e, t, n) {
  return Te(n, t(n.late(e)));
}), wb = T("brak", function(e) {
  return e.when(Gn(!1, !0), (t) => gt(t, Be)._late(0.25));
}), Tc = T(
  "rev",
  function(e) {
    const t = function(n) {
      const r = n.span, i = r.begin.sam(), s = r.begin.nextSam(), u = function(o) {
        const f = o.withTime((m) => i.add(s.sub(m))), h = f.begin;
        return f.begin = f.end, f.end = h, f;
      };
      return e.query(n.setSpan(u(r))).map((o) => o.withSpan(u));
    };
    return new z(t).splitQueries();
  },
  !1,
  !0
), Sb = T("pressBy", function(e, t) {
  return t.fmap((n) => Ye(n).compress(e, 1)).squeezeJoin();
}), Bb = T("press", function(e) {
  return e._pressBy(0.5);
});
z.prototype.hush = function() {
  return Be;
};
const _b = T(
  "palindrome",
  function(e) {
    return e.lastOf(2, Tc);
  },
  !0,
  !0
), { juxBy: kb, juxby: Ib } = T(["juxBy", "juxby"], function(e, t, n) {
  e /= 2;
  const r = function(u, a, o) {
    return a in u ? u[a] : o;
  }, i = n.withValue((u) => Object.assign({}, u, { pan: r(u, "pan", 0.5) - e })), s = t(n.withValue((u) => Object.assign({}, u, { pan: r(u, "pan", 0.5) + e })));
  return Te(i, s).setSteps(jt ? Ot(i._steps, s._steps) : void 0);
}), Vb = T("jux", function(e, t) {
  return t._juxBy(1, e, t);
}), { echoWith: Nb, echowith: Tb, stutWith: Lb, stutwith: Rb } = T(
  ["echoWith", "echowith", "stutWith", "stutwith"],
  function(e, t, n, r) {
    return Te(...Pu(0, e - 1).map((i) => n(r.late(j(t).mul(i)), i)));
  }
), Gb = T("echo", function(e, t, n, r) {
  return r._echoWith(e, t, (i, s) => i.gain(Math.pow(n, s)));
}), Xb = T("stut", function(e, t, n, r) {
  return r._echoWith(e, n, (i, s) => i.gain(Math.pow(t, s)));
}), _u = function(e, t, n = !1) {
  return e = j(e), Gn(
    ...Pu(0, e.sub(1)).map(
      (r) => n ? t.late(j(r).div(e)) : t.early(j(r).div(e))
    )
  );
}, Zb = T(
  "iter",
  function(e, t) {
    return _u(e, t, !1);
  },
  !0,
  !0
), { iterBack: Wb, iterback: Ob } = T(
  ["iterBack", "iterback"],
  function(e, t) {
    return _u(e, t, !0);
  },
  !0,
  !0
), { repeatCycles: zb } = T(
  "repeatCycles",
  function(e, t) {
    return new z(function(n) {
      const r = n.span.begin.sam(), i = r.div(e).sam(), s = r.sub(i);
      return n = n.withSpan((u) => u.withTime((a) => a.sub(s))), t.query(n).map((u) => u.withSpan((a) => a.withTime((o) => o.add(s))));
    }).splitQueries();
  },
  !0,
  !0
), ku = function(e, t, n, r = !1, i = !1) {
  const s = Array(e - 1).fill(!1);
  s.unshift(!0);
  const u = _u(e, Bt(...s), !r);
  return i || (n = n.repeatCycles(e)), n.when(u, t);
}, { chunk: jb, slowchunk: $b, slowChunk: qb } = T(
  ["chunk", "slowchunk", "slowChunk"],
  function(e, t, n) {
    return ku(e, t, n, !1, !1);
  },
  !0,
  !0
), { chunkBack: Kb, chunkback: Hb } = T(
  ["chunkBack", "chunkback"],
  function(e, t, n) {
    return ku(e, t, n, !0);
  },
  !0,
  !0
), { fastchunk: Jb, fastChunk: Yb } = T(
  ["fastchunk", "fastChunk"],
  function(e, t, n) {
    return ku(e, t, n, !1, !0);
  },
  !0,
  !0
), Ub = T(
  "bypass",
  function(e, t) {
    return e = !!parseInt(e), e ? Be : t;
  },
  !0,
  !0
), { ribbon: Qb, rib: eA } = T(
  ["ribbon", "rib"],
  (e, t, n) => n.early(e).restart(Ye(1).slow(t))
), tA = T("hsla", (e, t, n, r, i) => i.color(`hsla(${e}turn,${t * 100}%,${n * 100}%,${r})`)), nA = T("hsl", (e, t, n, r) => r.color(`hsl(${e}turn,${t * 100}%,${n * 100}%)`));
z.prototype.tag = function(e) {
  return this.withContext((t) => ({ ...t, tags: (t.tags || []).concat([e]) }));
};
const rA = T("filter", (e, t) => t.withHaps((n) => n.filter(e))), iA = T("filterWhen", (e, t) => t.filter((n) => e(n.whole.begin))), sA = T(
  "within",
  (e, t, n, r) => Te(
    n(r.filterWhen((i) => i.cyclePos() >= e && i.cyclePos() <= t)),
    r.filterWhen((i) => i.cyclePos() < e || i.cyclePos() > t)
  )
);
z.prototype.stepJoin = function() {
  const e = this, t = dt(...tu(nu(e.queryArc(0, 1))))._steps, n = function(r) {
    const s = e.early(r.span.begin.sam()).query(r.setSpan(new He(j(0), j(1))));
    return dt(...tu(nu(s))).query(r);
  };
  return new z(n, t);
};
z.prototype.stepBind = function(e) {
  return this.fmap(e).stepJoin();
};
function tu(e) {
  const t = e.filter((s, u) => u.hasSteps).reduce((s, u) => s.add(u), j(0)), n = Ar(e.map((s, u) => u._steps)).reduce(
    (s, u) => s.add(u),
    j(0)
  ), r = t.eq(0) ? void 0 : n.div(t);
  function i(s, u) {
    return u._steps === void 0 ? [s.mulmaybe(r), u] : [u._steps, u];
  }
  return e.map((s) => i(...s));
}
function nu(e) {
  const t = An(e.map((i) => [i.part.begin, i.part.end])), n = Mc([j(0), j(1), ...t]);
  return Ac(n).map((i) => [
    i[1].sub(i[0]),
    Te(...Lc(new He(...i), e).map((s) => s.value.withHap((u) => u.setContext(u.combineContext(s)))))
  ]);
}
function Lc(e, t) {
  return Ar(t.map((n) => Rc(e, n)));
}
function Rc(e, t) {
  const n = e.intersection(t.part);
  if (n != null)
    return new $e(t.whole, n, t.value, t.context);
}
const Gc = T("pace", function(e, t) {
  return t._steps === void 0 ? t : t._steps.eq(j(0)) ? Mt : t._fast(j(e).div(t._steps)).setSteps(e);
});
function Xc(e, ...t) {
  const n = t.map((i) => eu(i));
  if (n.length == 0)
    return Be;
  e == 0 && (e = n[0][1]);
  const r = [];
  for (const i of n)
    i[1] != 0 && (e == i[1] ? r.push(i[0]) : r.push(i[0]._fast(j(e).div(j(i[1])))));
  return Te(...r);
}
function Wi(...e) {
  if (Array.isArray(e[0]))
    return Xc(0, ...e);
  if (e = e.filter((r) => r.hasSteps), e.length == 0)
    return Be;
  const t = Ot(...e.map((r) => r._steps));
  if (t.eq(j(0)))
    return Mt;
  const n = Te(...e.map((r) => r.pace(t)));
  return n._steps = t, n;
}
function dt(...e) {
  if (e.length === 0)
    return Mt;
  const t = (u) => Array.isArray(u) ? u : [u._steps, u];
  if (e = e.map(t), e.find((u) => u[0] === void 0)) {
    const u = e.map((o) => o[0]).filter((o) => o !== void 0);
    if (u.length === 0)
      return gt(...e.map((o) => o[1]));
    if (u.length === e.length)
      return Mt;
    const a = u.reduce((o, f) => o.add(f), j(0)).div(u.length);
    for (let o of e)
      o[0] === void 0 && (o[0] = a);
  }
  if (e.length == 1)
    return K(e[0][1]).withSteps((a) => e[0][0]);
  const n = e.map((u) => u[0]).reduce((u, a) => u.add(a), j(0));
  let r = j(0);
  const i = [];
  for (const [u, a] of e) {
    if (j(u).eq(0))
      continue;
    const o = r.add(u);
    i.push(K(a)._compress(r.div(n), o.div(n))), r = o;
  }
  const s = Te(...i);
  return s._steps = n, s;
}
function Zc(...e) {
  e = e.map((i) => Array.isArray(i) ? i.map(K) : [K(i)]);
  const t = Ot(...e.map((i) => j(i.length)));
  let n = [];
  for (let i = 0; i < t; ++i)
    n.push(...e.map((s) => s.length == 0 ? Be : s[i % s.length]));
  n = n.filter((i) => i.hasSteps && i._steps > 0);
  const r = n.reduce((i, s) => i.add(s._steps), j(0));
  return n = dt(...n), n._steps = r, n;
}
const Wc = ti("take", function(e, t) {
  if (!t.hasSteps || t._steps.lte(0) || (e = j(e), e.eq(0)))
    return Mt;
  const n = e < 0;
  n && (e = e.abs());
  const r = e.div(t._steps);
  return r.lte(0) ? Mt : r.gte(1) ? t : n ? t.zoom(j(1).sub(r), 1) : t.zoom(0, r);
}), Oc = ti("drop", function(e, t) {
  return t.hasSteps ? (e = j(e), e.lt(0) ? t.take(t._steps.add(e)) : t.take(j(0).sub(t._steps.sub(e)))) : Mt;
}), zc = ti("extend", function(e, t) {
  return t.fast(e).expand(e);
}), jc = ti("expand", function(e, t) {
  return t.withSteps((n) => n.mul(j(e)));
}), $c = ti("contract", function(e, t) {
  return t.withSteps((n) => n.div(j(e)));
});
z.prototype.shrinklist = function(e) {
  const t = this;
  if (!t.hasSteps)
    return [t];
  let [n, r] = Array.isArray(e) ? e : [e, t._steps];
  if (n = j(n), r === 0 || n === 0)
    return [t];
  const i = n > 0, s = [];
  if (i) {
    const u = j(1).div(t._steps).mul(n);
    for (let a = 0; a < r; ++a) {
      const o = u.mul(a);
      if (o.gt(1))
        break;
      s.push([o, 1]);
    }
  } else {
    n = j(0).sub(n);
    const u = j(1).div(t._steps).mul(n);
    for (let a = 0; a < r; ++a) {
      const o = j(1).sub(u.mul(a));
      if (o.lt(0))
        break;
      s.push([j(0), o]);
    }
  }
  return s.map((u) => t.zoom(...u));
};
const qc = (e, t) => t.shrinklist(e), Kc = T(
  "shrink",
  function(e, t) {
    if (!t.hasSteps)
      return Mt;
    const n = t.shrinklist(e), r = dt(...n);
    return r._steps = n.reduce((i, s) => i.add(s._steps), j(0)), r;
  },
  !0,
  !1,
  (e) => e.stepJoin()
), uA = T(
  "grow",
  function(e, t) {
    if (!t.hasSteps)
      return Mt;
    const n = t.shrinklist(j(0).sub(e));
    n.reverse();
    const r = dt(...n);
    return r._steps = n.reduce((i, s) => i.add(s._steps), j(0)), r;
  },
  !0,
  !1,
  (e) => e.stepJoin()
), Hc = function(e, ...t) {
  return e.tour(...t);
};
z.prototype.tour = function(...e) {
  return dt(
    ...[].concat(
      ...e.map((t, n) => [...e.slice(0, e.length - n), this, ...e.slice(e.length - n)]),
      this,
      ...e
    )
  );
};
const Jc = function(...e) {
  e = e.filter((r) => r.hasSteps);
  const t = Gn(...e.map((r) => r._slow(r._steps))), n = Ot(...e.map((r) => r._steps));
  return t._fast(n).setSteps(n);
}, aA = dt, Iu = dt, oA = dt, cA = Zc, lA = Wi;
z.prototype.s_polymeter = z.prototype.polymeter;
const fA = Kc;
z.prototype.s_taper = z.prototype.shrink;
const hA = qc;
z.prototype.s_taperlist = z.prototype.shrinklist;
const pA = Wc;
z.prototype.s_add = z.prototype.take;
const dA = Oc;
z.prototype.s_sub = z.prototype.drop;
const mA = jc;
z.prototype.s_expand = z.prototype.expand;
const gA = zc;
z.prototype.s_extend = z.prototype.extend;
const yA = $c;
z.prototype.s_contract = z.prototype.contract;
const bA = Hc;
z.prototype.s_tour = z.prototype.tour;
const AA = Jc;
z.prototype.s_zip = z.prototype.zip;
const MA = Gc;
z.prototype.steps = z.prototype.pace;
const CA = T("chop", function(e, t) {
  const r = Array.from({ length: e }, (u, a) => a).map((u) => ({ begin: u / e, end: (u + 1) / e })), i = function(u, a) {
    if ("begin" in u && "end" in u && u.begin !== void 0 && u.end !== void 0) {
      const o = u.end - u.begin;
      a = { begin: u.begin + a.begin * o, end: u.begin + a.end * o };
    }
    return Object.assign({}, u, a);
  }, s = function(u) {
    return Bt(r.map((a) => i(u, a)));
  };
  return t.squeezeBind(s).setSteps(jt ? j(e).mulmaybe(t._steps) : void 0);
}), vA = T("striate", function(e, t) {
  const r = Array.from({ length: e }, (s, u) => u).map((s) => ({ begin: s / e, end: (s + 1) / e })), i = Gn(...r);
  return t.set(i)._fast(e).setSteps(jt ? j(e).mulmaybe(t._steps) : void 0);
}), Yc = function(e, t, n = 0.5) {
  return t.speed(1 / e * n).unit("c").slow(e);
}, Uc = T(
  "slice",
  function(e, t, n) {
    return e.innerBind(
      (r) => t.outerBind(
        (i) => n.outerBind((s) => {
          s = s instanceof Object ? s : { s };
          const u = Array.isArray(r) ? r[i] : i / r, a = Array.isArray(r) ? r[i + 1] : (i + 1) / r;
          return Ye({ begin: u, end: a, _slices: r, ...s });
        })
      )
    ).setSteps(t._steps);
  },
  !1
  // turns off auto-patternification
), PA = T(
  "splice",
  function(e, t, n) {
    const r = Uc(e, t, n);
    return new z((i) => {
      const s = i.controls._cps || 1;
      return r.query(i).map(
        (a) => a.withValue((o) => ({
          speed: s / o._slices / a.whole.duration * (o.speed || 1),
          unit: "c",
          ...o
        }))
      );
    }).setSteps(t._steps);
  },
  !1
  // turns off auto-patternification
), { loopAt: DA, loopat: FA } = T(["loopAt", "loopat"], function(e, t) {
  const n = t._steps ? t._steps.div(e) : void 0;
  return new z((r) => Yc(e, t, r.controls._cps).query(r), n);
}), EA = T(
  "fit",
  (e) => e.withHaps(
    (t, n) => t.map(
      (r) => r.withValue((i) => {
        const s = ("end" in i ? i.end : 1) - ("begin" in i ? i.begin : 0);
        return {
          ...i,
          speed: (n.controls._cps || 1) / r.whole.duration * s,
          unit: "c"
        };
      })
    )
  )
), { loopAtCps: xA, loopatcps: wA } = T(["loopAtCps", "loopatcps"], function(e, t, n) {
  return Yc(e, n, t);
}), SA = (e) => Ye(1).withValue(() => K(e())).innerJoin();
let Qa = (e) => e < 0.5 ? 1 : 1 - (e - 0.5) / 0.5, Qc = (e, t, n) => {
  t = K(t), e = K(e), n = K(n);
  let r = t.fmap((s) => ({ gain: Qa(s) })), i = t.fmap((s) => ({ gain: Qa(1 - s) }));
  return Te(e.mul(r), n.mul(i));
};
z.prototype.xfade = function(e, t) {
  return Qc(this, e, t);
};
const BA = (e) => (t, n, r) => {
  t = j(t).mod(n), n = j(n);
  const i = t.div(n), s = t.add(1).div(n);
  return e(r.fmap((u) => Ye(u)._compress(i, s)));
}, { beat: _A } = T(
  ["beat"],
  BA((e) => e.innerJoin())
);
function Oi(e) {
  let t = Array.isArray(e);
  e = t ? e : [e];
  const n = e[0], r = (u) => {
    let a;
    if (typeof u == "object" && u.value !== void 0 && (a = { ...u }, u = u.value, delete a.value), t && Array.isArray(u)) {
      const o = a || {};
      return u.forEach((f, h) => {
        h < e.length && (o[e[h]] = f);
      }), o;
    } else return a ? (a[n] = u, a) : { [n]: u };
  }, i = (...u) => Bt(...u).withValue(r), s = function(...u) {
    return u.length ? this.set(i(...u)) : this.fmap(r);
  };
  return z.prototype[n] = s, i;
}
const ru = /* @__PURE__ */ new Map();
function w(e, ...t) {
  const n = Array.isArray(e) ? e[0] : e;
  let r = {};
  return r[n] = Oi(e), t.forEach((i) => {
    r[i] = r[n], ru.set(i, n), z.prototype[i] = z.prototype[n];
  }), r;
}
const { s: el, sound: tl } = w(["s", "n", "gain"], "sound"), { source: nl, src: rl } = w("source", "src"), { n: il } = w("n"), { note: sl } = w(["note", "n"]), { accelerate: ul } = w("accelerate"), { velocity: al } = w("velocity"), { gain: ol } = w("gain"), { postgain: cl } = w("postgain"), { amp: ll } = w("amp"), { attack: fl, att: hl } = w("attack", "att"), { fmh: pl } = w(["fmh", "fmi"], "fmh"), { fmi: dl, fm: ml } = w(["fmi", "fmh"], "fm"), { fmenv: gl } = w("fmenv"), { fmattack: yl } = w("fmattack"), { fmdecay: bl } = w("fmdecay"), { fmsustain: Al } = w("fmsustain"), { fmrelease: Ml } = w("fmrelease"), { fmvelocity: Cl } = w("fmvelocity"), { bank: vl } = w("bank"), { analyze: Pl } = w("analyze"), { fft: Dl } = w("fft"), { decay: Fl, dec: El } = w("decay", "dec"), { sustain: xl, sus: wl } = w("sustain", "sus"), { release: Sl, rel: Bl } = w("release", "rel"), { hold: _l } = w("hold"), { bandf: kl, bpf: Il, bp: Vl } = w(["bandf", "bandq", "bpenv"], "bpf", "bp"), { bandq: Nl, bpq: Tl } = w("bandq", "bpq"), { begin: Ll } = w("begin"), { end: Rl } = w("end"), { loop: Gl } = w("loop"), { loopBegin: Xl, loopb: Zl } = w("loopBegin", "loopb"), { loopEnd: Wl, loope: Ol } = w("loopEnd", "loope"), { crush: zl } = w("crush"), { coarse: jl } = w("coarse"), { drive: $l } = w("drive"), { byteBeatExpression: ql, bbexpr: Kl } = w("byteBeatExpression", "bbexpr"), { byteBeatStartTime: Hl, bbst: Jl } = w("byteBeatStartTime", "bbst"), { channels: Yl, ch: Ul } = w("channels", "ch"), { pw: Ql } = w(["pw", "pwrate", "pwsweep"]), { pwrate: e0 } = w("pwrate"), { pwsweep: t0 } = w("pwsweep"), { phaserrate: n0, ph: r0, phaser: i0 } = w(
  ["phaserrate", "phaserdepth", "phasercenter", "phasersweep"],
  "ph",
  "phaser"
), { phasersweep: s0, phs: u0 } = w("phasersweep", "phs"), { phasercenter: a0, phc: o0 } = w("phasercenter", "phc"), { phaserdepth: c0, phd: l0, phasdp: f0 } = w("phaserdepth", "phd", "phasdp"), { channel: h0 } = w("channel"), { cut: p0 } = w("cut"), { cutoff: d0, ctf: m0, lpf: g0, lp: y0 } = w(["cutoff", "resonance", "lpenv"], "ctf", "lpf", "lp"), { lpenv: b0, lpe: A0 } = w("lpenv", "lpe"), { hpenv: M0, hpe: C0 } = w("hpenv", "hpe"), { bpenv: v0, bpe: P0 } = w("bpenv", "bpe"), { lpattack: D0, lpa: F0 } = w("lpattack", "lpa"), { hpattack: E0, hpa: x0 } = w("hpattack", "hpa"), { bpattack: w0, bpa: S0 } = w("bpattack", "bpa"), { lpdecay: B0, lpd: _0 } = w("lpdecay", "lpd"), { hpdecay: k0, hpd: I0 } = w("hpdecay", "hpd"), { bpdecay: V0, bpd: N0 } = w("bpdecay", "bpd"), { lpsustain: T0, lps: L0 } = w("lpsustain", "lps"), { hpsustain: R0, hps: G0 } = w("hpsustain", "hps"), { bpsustain: X0, bps: Z0 } = w("bpsustain", "bps"), { lprelease: W0, lpr: O0 } = w("lprelease", "lpr"), { hprelease: z0, hpr: j0 } = w("hprelease", "hpr"), { bprelease: $0, bpr: q0 } = w("bprelease", "bpr"), { ftype: K0 } = w("ftype"), { fanchor: H0 } = w("fanchor"), { vib: J0, vibrato: Y0, v: U0 } = w(["vib", "vibmod"], "vibrato", "v"), { noise: Q0 } = w("noise"), { vibmod: ef, vmod: tf } = w(["vibmod", "vib"], "vmod"), { hcutoff: nf, hpf: rf, hp: sf } = w(["hcutoff", "hresonance", "hpenv"], "hpf", "hp"), { hresonance: uf, hpq: af } = w("hresonance", "hpq"), { resonance: of, lpq: cf } = w("resonance", "lpq"), { djf: lf } = w("djf"), { delay: ff } = w(["delay", "delaytime", "delayfeedback"]), { delayfeedback: hf, delayfb: pf, dfb: df } = w("delayfeedback", "delayfb", "dfb"), { delaytime: mf, delayt: gf, dt: yf } = w("delaytime", "delayt", "dt"), { lock: bf } = w("lock"), { detune: Af, det: Mf } = w("detune", "det"), { unison: Cf } = w("unison"), { spread: vf } = w("spread"), { dry: Pf } = w("dry"), { fadeTime: Df, fadeOutTime: Ff } = w("fadeTime", "fadeOutTime"), { fadeInTime: Ef } = w("fadeInTime"), { freq: xf } = w("freq"), { pattack: wf, patt: Sf } = w("pattack", "patt"), { pdecay: Bf, pdec: _f } = w("pdecay", "pdec"), { psustain: kf, psus: If } = w("psustain", "psus"), { prelease: Vf, prel: Nf } = w("prelease", "prel"), { penv: Tf } = w("penv"), { pcurve: Lf } = w("pcurve"), { panchor: Rf } = w("panchor"), { gate: Gf, gat: Xf } = w("gate", "gat"), { leslie: Zf } = w("leslie"), { lrate: Wf } = w("lrate"), { lsize: Of } = w("lsize"), { activeLabel: zf } = w("activeLabel"), { label: jf } = w(["label", "activeLabel"]), { degree: $f } = w("degree"), { mtranspose: qf } = w("mtranspose"), { ctranspose: Kf } = w("ctranspose"), { harmonic: Hf } = w("harmonic"), { stepsPerOctave: Jf } = w("stepsPerOctave"), { octaveR: Yf } = w("octaveR"), { nudge: Uf } = w("nudge"), { octave: Qf } = w("octave"), { orbit: eh } = w("orbit"), { overgain: th } = w("overgain"), { overshape: nh } = w("overshape"), { pan: rh } = w("pan"), { panspan: ih } = w("panspan"), { pansplay: sh } = w("pansplay"), { panwidth: uh } = w("panwidth"), { panorient: ah } = w("panorient"), { rate: oh } = w("rate"), { slide: ch } = w("slide"), { semitone: lh } = w("semitone"), { voice: fh } = w("voice"), { chord: hh } = w("chord"), { dictionary: ph, dict: dh } = w("dictionary", "dict"), { anchor: mh } = w("anchor"), { offset: gh } = w("offset"), { octaves: yh } = w("octaves"), { mode: bh } = w(["mode", "anchor"]), { room: Ah } = w(["room", "size"]), { roomlp: Mh, rlp: Ch } = w("roomlp", "rlp"), { roomdim: vh, rdim: Ph } = w("roomdim", "rdim"), { roomfade: Dh, rfade: Fh } = w("roomfade", "rfade"), { ir: Eh, iresponse: xh } = w(["ir", "i"], "iresponse"), { roomsize: wh, size: Sh, sz: Bh, rsize: _h } = w("roomsize", "size", "sz", "rsize"), { shape: kh } = w(["shape", "shapevol"]), { distort: Ih, dist: Vh } = w(["distort", "distortvol"], "dist"), { compressor: Nh } = w([
  "compressor",
  "compressorRatio",
  "compressorKnee",
  "compressorAttack",
  "compressorRelease"
]), { compressorKnee: Th } = w("compressorKnee"), { compressorRatio: Lh } = w("compressorRatio"), { compressorAttack: Rh } = w("compressorAttack"), { compressorRelease: Gh } = w("compressorRelease"), { speed: Vu } = w("speed"), { stretch: Xh } = w("stretch"), { unit: Zh } = w("unit"), { squiz: Wh } = w("squiz"), { vowel: Oh } = w("vowel"), { waveloss: zh } = w("waveloss"), { density: kA } = w("density"), { expression: jh } = w("expression"), { sustainpedal: $h } = w("sustainpedal"), { tremolodepth: qh, tremdp: Kh } = w("tremolodepth", "tremdp"), { tremolorate: Hh, tremr: Jh } = w("tremolorate", "tremr"), { fshift: Yh } = w("fshift"), { fshiftnote: Uh } = w("fshiftnote"), { fshiftphase: Qh } = w("fshiftphase"), { triode: e1 } = w("triode"), { krush: t1 } = w("krush"), { kcutoff: n1 } = w("kcutoff"), { octer: r1 } = w("octer"), { octersub: i1 } = w("octersub"), { octersubsub: s1 } = w("octersubsub"), { ring: u1 } = w("ring"), { ringf: a1 } = w("ringf"), { ringdf: o1 } = w("ringdf"), { freeze: c1 } = w("freeze"), { xsdelay: l1 } = w("xsdelay"), { tsdelay: f1 } = w("tsdelay"), { real: h1 } = w("real"), { imag: p1 } = w("imag"), { enhance: d1 } = w("enhance"), { partials: m1 } = w("partials"), { comb: g1 } = w("comb"), { smear: y1 } = w("smear"), { scram: b1 } = w("scram"), { binshift: A1 } = w("binshift"), { hbrick: M1 } = w("hbrick"), { lbrick: C1 } = w("lbrick"), { frameRate: v1 } = w("frameRate"), { frames: P1 } = w("frames"), { hours: D1 } = w("hours"), { minutes: F1 } = w("minutes"), { seconds: E1 } = w("seconds"), { songPtr: x1 } = w("songPtr"), { uid: w1 } = w("uid"), { val: S1 } = w("val"), { cps: B1 } = w("cps"), { clip: _1, legato: k1 } = w("clip", "legato"), { duration: I1, dur: V1 } = w("duration", "dur"), { zrand: N1 } = w("zrand"), { curve: T1 } = w("curve"), { deltaSlide: L1 } = w("deltaSlide"), { pitchJump: R1 } = w("pitchJump"), { pitchJumpTime: G1 } = w("pitchJumpTime"), { lfo: X1, repeatTime: Z1 } = w("lfo", "repeatTime"), { znoise: W1 } = w("znoise"), { zmod: O1 } = w("zmod"), { zcrush: z1 } = w("zcrush"), { zdelay: j1 } = w("zdelay"), { tremolo: $1 } = w("tremolo"), { zzfx: q1 } = w("zzfx"), { color: K1, colour: H1 } = w(["color", "colour"]);
let Nu = (...e) => e.reduce((t, n) => Object.assign(t, { [n]: Oi(n) }), {});
const J1 = T("adsr", (e, t) => {
  e = Array.isArray(e) ? e : [e];
  const [n, r, i, s] = e;
  return t.set({ attack: n, decay: r, sustain: i, release: s });
}), Y1 = T("ad", (e, t) => {
  e = Array.isArray(e) ? e : [e];
  const [n, r = n] = e;
  return t.attack(n).decay(r);
}), U1 = T("ds", (e, t) => {
  e = Array.isArray(e) ? e : [e];
  const [n, r = 0] = e;
  return t.set({ decay: n, sustain: r });
}), Q1 = T("ar", (e, t) => {
  e = Array.isArray(e) ? e : [e];
  const [n, r = n] = e;
  return t.set({ attack: n, release: r });
}), { midichan: ep } = w("midichan"), { midimap: tp } = w("midimap"), { midiport: np } = w("midiport"), { midicmd: rp } = w("midicmd"), ip = T("control", (e, t) => {
  if (!Array.isArray(e))
    throw new Error("control expects an array of [ccn, ccv]");
  const [n, r] = e;
  return t.ccn(n).ccv(r);
}), { ccn: sp } = w("ccn"), { ccv: up } = w("ccv"), { ctlNum: ap } = w("ctlNum"), { nrpnn: op } = w("nrpnn"), { nrpv: cp } = w("nrpv"), { progNum: lp } = w("progNum"), fp = T("sysex", (e, t) => {
  if (!Array.isArray(e))
    throw new Error("sysex expects an array of [id, data]");
  const [n, r] = e;
  return t.sysexid(n).sysexdata(r);
}), { sysexid: hp } = w("sysexid"), { sysexdata: pp } = w("sysexdata"), { midibend: dp } = w("midibend"), { miditouch: mp } = w("miditouch"), { polyTouch: gp } = w("polyTouch"), Tu = (e) => ru.has(e) ? ru.get(e) : e, yp = T("as", (e, t) => (e = Array.isArray(e) ? e : [e], t.fmap((n) => (n = Array.isArray(n) ? n : [n], n = Object.fromEntries(e.map((r, i) => [Tu(r), n[i]])), n)))), bp = T(
  "scrub",
  (e, t) => e.outerBind((n) => {
    Array.isArray(n) || (n = [n]);
    const [r, i = 1] = n;
    return t.begin(r).mul(Vu(i)).clip(1);
  }),
  !1
), IA = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accelerate: ul,
  activeLabel: zf,
  ad: Y1,
  adsr: J1,
  amp: ll,
  analyze: Pl,
  anchor: mh,
  ar: Q1,
  as: yp,
  att: hl,
  attack: fl,
  bandf: kl,
  bandq: Nl,
  bank: vl,
  bbexpr: Kl,
  bbst: Jl,
  begin: Ll,
  binshift: A1,
  bp: Vl,
  bpa: S0,
  bpattack: w0,
  bpd: N0,
  bpdecay: V0,
  bpe: P0,
  bpenv: v0,
  bpf: Il,
  bpq: Tl,
  bpr: q0,
  bprelease: $0,
  bps: Z0,
  bpsustain: X0,
  byteBeatExpression: ql,
  byteBeatStartTime: Hl,
  ccn: sp,
  ccv: up,
  ch: Ul,
  channel: h0,
  channels: Yl,
  chord: hh,
  clip: _1,
  coarse: jl,
  color: K1,
  colour: H1,
  comb: g1,
  compressor: Nh,
  compressorAttack: Rh,
  compressorKnee: Th,
  compressorRatio: Lh,
  compressorRelease: Gh,
  control: ip,
  cps: B1,
  createParam: Oi,
  createParams: Nu,
  crush: zl,
  ctf: m0,
  ctlNum: ap,
  ctranspose: Kf,
  curve: T1,
  cut: p0,
  cutoff: d0,
  dec: El,
  decay: Fl,
  degree: $f,
  delay: ff,
  delayfb: pf,
  delayfeedback: hf,
  delayt: gf,
  delaytime: mf,
  deltaSlide: L1,
  density: kA,
  det: Mf,
  detune: Af,
  dfb: df,
  dict: dh,
  dictionary: ph,
  dist: Vh,
  distort: Ih,
  djf: lf,
  drive: $l,
  dry: Pf,
  ds: U1,
  dt: yf,
  dur: V1,
  duration: I1,
  end: Rl,
  enhance: d1,
  expression: jh,
  fadeInTime: Ef,
  fadeOutTime: Ff,
  fadeTime: Df,
  fanchor: H0,
  fft: Dl,
  fm: ml,
  fmattack: yl,
  fmdecay: bl,
  fmenv: gl,
  fmh: pl,
  fmi: dl,
  fmrelease: Ml,
  fmsustain: Al,
  fmvelocity: Cl,
  frameRate: v1,
  frames: P1,
  freeze: c1,
  freq: xf,
  fshift: Yh,
  fshiftnote: Uh,
  fshiftphase: Qh,
  ftype: K0,
  gain: ol,
  gat: Xf,
  gate: Gf,
  getControlName: Tu,
  harmonic: Hf,
  hbrick: M1,
  hcutoff: nf,
  hold: _l,
  hours: D1,
  hp: sf,
  hpa: x0,
  hpattack: E0,
  hpd: I0,
  hpdecay: k0,
  hpe: C0,
  hpenv: M0,
  hpf: rf,
  hpq: af,
  hpr: j0,
  hprelease: z0,
  hps: G0,
  hpsustain: R0,
  hresonance: uf,
  imag: p1,
  ir: Eh,
  iresponse: xh,
  kcutoff: n1,
  krush: t1,
  label: jf,
  lbrick: C1,
  legato: k1,
  leslie: Zf,
  lfo: X1,
  lock: bf,
  loop: Gl,
  loopBegin: Xl,
  loopEnd: Wl,
  loopb: Zl,
  loope: Ol,
  lp: y0,
  lpa: F0,
  lpattack: D0,
  lpd: _0,
  lpdecay: B0,
  lpe: A0,
  lpenv: b0,
  lpf: g0,
  lpq: cf,
  lpr: O0,
  lprelease: W0,
  lps: L0,
  lpsustain: T0,
  lrate: Wf,
  lsize: Of,
  midibend: dp,
  midichan: ep,
  midicmd: rp,
  midimap: tp,
  midiport: np,
  miditouch: mp,
  minutes: F1,
  mode: bh,
  mtranspose: qf,
  n: il,
  noise: Q0,
  note: sl,
  nrpnn: op,
  nrpv: cp,
  nudge: Uf,
  octave: Qf,
  octaveR: Yf,
  octaves: yh,
  octer: r1,
  octersub: i1,
  octersubsub: s1,
  offset: gh,
  orbit: eh,
  overgain: th,
  overshape: nh,
  pan: rh,
  panchor: Rf,
  panorient: ah,
  panspan: ih,
  pansplay: sh,
  panwidth: uh,
  partials: m1,
  patt: Sf,
  pattack: wf,
  pcurve: Lf,
  pdec: _f,
  pdecay: Bf,
  penv: Tf,
  ph: r0,
  phasdp: f0,
  phaser: i0,
  phasercenter: a0,
  phaserdepth: c0,
  phaserrate: n0,
  phasersweep: s0,
  phc: o0,
  phd: l0,
  phs: u0,
  pitchJump: R1,
  pitchJumpTime: G1,
  polyTouch: gp,
  postgain: cl,
  prel: Nf,
  prelease: Vf,
  progNum: lp,
  psus: If,
  psustain: kf,
  pw: Ql,
  pwrate: e0,
  pwsweep: t0,
  rate: oh,
  rdim: Ph,
  real: h1,
  registerControl: w,
  rel: Bl,
  release: Sl,
  repeatTime: Z1,
  resonance: of,
  rfade: Fh,
  ring: u1,
  ringdf: o1,
  ringf: a1,
  rlp: Ch,
  room: Ah,
  roomdim: vh,
  roomfade: Dh,
  roomlp: Mh,
  roomsize: wh,
  rsize: _h,
  s: el,
  scram: b1,
  scrub: bp,
  seconds: E1,
  semitone: lh,
  shape: kh,
  size: Sh,
  slide: ch,
  smear: y1,
  songPtr: x1,
  sound: tl,
  source: nl,
  speed: Vu,
  spread: vf,
  squiz: Wh,
  src: rl,
  stepsPerOctave: Jf,
  stretch: Xh,
  sus: wl,
  sustain: xl,
  sustainpedal: $h,
  sysex: fp,
  sysexdata: pp,
  sysexid: hp,
  sz: Bh,
  tremdp: Kh,
  tremolo: $1,
  tremolodepth: qh,
  tremolorate: Hh,
  tremr: Jh,
  triode: e1,
  tsdelay: f1,
  uid: w1,
  unison: Cf,
  unit: Zh,
  v: U0,
  val: S1,
  velocity: al,
  vib: J0,
  vibmod: ef,
  vibrato: Y0,
  vmod: tf,
  voice: fh,
  vowel: Oh,
  waveloss: zh,
  xsdelay: l1,
  zcrush: z1,
  zdelay: j1,
  zmod: O1,
  znoise: W1,
  zrand: N1,
  zzfx: q1
}, Symbol.toStringTag, { value: "Module" })), VA = function(e, t) {
  const [n, r] = e, [i, s] = t, [u, a] = Eu(r, i);
  return [
    [r, n - r],
    [xu((o, f) => o.concat(f), u, s), a]
  ];
}, NA = function(e, t) {
  const [n, r] = e, [i, s] = t, [u, a] = Eu(n, s);
  return [
    [n, r - n],
    [xu((f, h) => f.concat(h), i, u), a]
  ];
}, Ap = function(e, t) {
  const [n, r] = e;
  return Math.min(n, r) <= 1 ? [e, t] : Ap(...n > r ? VA(e, t) : NA(e, t));
}, Mp = function(e, t) {
  const n = e < 0;
  e = Math.abs(e);
  const r = t - e, i = Array(e).fill([1]), s = Array(r).fill([0]), u = Ap([e, r], [i, s]), a = An(u[1][0]).concat(An(u[1][1]));
  return n ? a.map((o) => o === 0 ? 1 : 0) : a;
}, Lu = function(e, t, n) {
  const r = Mp(e, t);
  return n ? gc(r, -n) : r;
}, TA = T("euclid", function(e, t, n) {
  return n.struct(Lu(e, t, 0));
}), { euclidrot: LA, euclidRot: RA } = T(["euclidrot", "euclidRot"], function(e, t, n, r) {
  return r.struct(Lu(e, t, n));
}), Cp = function(e, t, n, r) {
  if (e < 1)
    return Be;
  const s = Lu(e, t, n).join("").split("1").slice(1).map((u) => [u.length + 1, !0]);
  return r.struct(Iu(...s));
}, GA = T(["euclidLegato"], function(e, t, n) {
  return Cp(e, t, 0, n);
}), XA = T(["euclidLegatoRot"], function(e, t, n, r) {
  return Cp(e, t, n, r);
});
function vp(e, t, n = 0.05, r = 0.1, i = 0.1, s = globalThis.setInterval, u = globalThis.clearInterval, a = !0) {
  let o = 0, f = 0, h = 10 ** 4, m = 0.01;
  const p = (S) => n = S(n);
  i = i || r / 2;
  const A = () => {
    const S = e(), x = S + r + i;
    for (f === 0 && (f = S + m); f < x; )
      f = a ? Math.round(f * h) / h : f, t(f, n, o, S), f += n, o++;
  };
  let M;
  const v = () => {
    E(), A(), M = s(A, r * 1e3);
  }, E = () => {
    M !== void 0 && u(M), M = void 0;
  };
  return { setDuration: p, start: v, stop: () => {
    o = 0, f = 0, E();
  }, pause: () => E(), duration: n, interval: r, getPhase: () => f, minLatency: m };
}
function ZA(e) {
  return new z((t) => [new $e(void 0, t.span, e)]);
}
const _t = (e) => {
  const t = (n) => [new $e(void 0, n.span, e(n.span.begin))];
  return new z(t);
}, ni = _t((e) => e % 1), Ru = ni.toBipolar(), zi = _t((e) => 1 - e % 1), Gu = zi.toBipolar(), Xu = _t((e) => Math.sin(Math.PI * 2 * e)), Pp = Xu.fromBipolar(), WA = Pp._early(j(1).div(4)), OA = Xu._early(j(1).div(4)), Dp = _t((e) => Math.floor(e * 2 % 2)), zA = Dp.toBipolar(), jA = gt(ni, zi), $A = gt(Ru, Gu), qA = gt(zi, ni), KA = gt(Gu, Ru), Fp = _t(cr);
let Zu = 0, Wu = 0;
typeof window < "u" && document.addEventListener("mousemove", (e) => {
  Zu = e.clientY / document.body.clientHeight, Wu = e.clientX / document.body.clientWidth;
});
const HA = _t(() => Zu), JA = _t(() => Zu), YA = _t(() => Wu), UA = _t(() => Wu), Ep = (e) => {
  const t = e << 13 ^ e, n = t >> 17 ^ t;
  return n << 5 ^ n;
}, QA = (e) => e - Math.trunc(e), xp = (e) => Ep(Math.trunc(QA(e / 300) * 536870912)), wp = (e) => e % 536870912 / 536870912, iu = (e) => Math.abs(wp(xp(e))), eM = (e, t) => {
  const n = [];
  for (let r = 0; r < t; ++r)
    n.push(wp(e)), e = Ep(e);
  return n;
}, tM = (e, t) => eM(xp(e), t), Sp = (e) => ni.range(0, e).round().segment(e), nM = (e) => {
  const t = K(e).log2(0).floor().add(1);
  return Bp(e, t);
}, Bp = (e, t = 16) => {
  t = K(t);
  const n = Sp(t).mul(-1).add(t.sub(1));
  return K(e).segment(t).brshift(n).band(Ye(1));
}, _p = (e) => _t((t) => {
  const r = tM(t.floor().add(0.5), e).map((s, u) => [s, u]).sort((s, u) => s[0] > u[0] - s[0] < u[0]).map((s) => s[1]), i = t.cyclePos().mul(e).floor() % e;
  return r[i];
})._segment(e), kp = (e, t, n) => {
  const r = [...Array(t).keys()].map((i) => n.zoom(j(i).div(t), j(i + 1).div(t)));
  return e.fmap((i) => r[i].repeatCycles(t)._fast(t)).innerJoin();
}, rM = T("shuffle", (e, t) => kp(_p(e), e, t)), iM = T("scramble", (e, t) => kp(zu(e)._segment(e), e, t)), mt = _t(iu), sM = mt.toBipolar(), Ou = (e) => mt.fmap((t) => t < e), uM = (e) => K(e).fmap(Ou).innerJoin(), aM = Ou(0.5), zu = (e) => mt.fmap((t) => Math.trunc(t * e)), oM = (e) => K(e).fmap(zu).innerJoin(), ju = (e, t) => (t = t.map(K), t.length == 0 ? Be : e.range(0, t.length).fmap((n) => {
  const r = Math.min(Math.max(Math.floor(n), 0), t.length - 1);
  return t[r];
})), ji = (e, t) => ju(e, t).outerJoin(), $u = (e, t) => ju(e, t).innerJoin(), cM = (...e) => ji(mt, e);
z.prototype.choose = function(...e) {
  return ji(this, e);
};
z.prototype.choose2 = function(...e) {
  return ji(this.fromBipolar(), e);
};
const Ip = (...e) => $u(mt.segment(1), e), lM = Ip, Vp = function(e, ...t) {
  const n = t.map((a) => K(a[0])), r = [];
  let i = Ye(0);
  for (const a of t)
    i = i.add(a[1]), r.push(i);
  const s = Sc(r), u = function(a) {
    const o = i.mul(a);
    return s.fmap((f) => (h) => n[f.findIndex((m) => m > h, f)]).appLeft(o);
  };
  return e.bind(u);
}, fM = (...e) => Vp(...e).outerJoin(), hM = (...e) => fM(mt, ...e), Np = (...e) => Vp(mt.segment(1), ...e).innerJoin(), pM = Np, Tp = (e) => {
  const t = e.fmap(Math.floor), n = e.fmap((s) => Math.floor(s) + 1), r = (s) => 6 * s ** 5 - 15 * s ** 4 + 10 * s ** 3, i = (s) => (u) => (a) => u + r(s) * (a - u);
  return e.sub(t).fmap(i).appBoth(t.fmap(iu)).appBoth(n.fmap(iu));
}, dM = Tp(Fp.fmap((e) => Number(e))), mM = T(
  "degradeByWith",
  (e, t, n) => n.fmap((r) => (i) => r).appLeft(e.filterValues((r) => r > t)),
  !0,
  !0
), gM = T(
  "degradeBy",
  function(e, t) {
    return t._degradeByWith(mt, e);
  },
  !0,
  !0
), yM = T("degrade", (e) => e._degradeBy(0.5), !0, !0), bM = T(
  "undegradeBy",
  function(e, t) {
    return t._degradeByWith(
      mt.fmap((n) => 1 - n),
      e
    );
  },
  !0,
  !0
), AM = T("undegrade", (e) => e._undegradeBy(0.5), !0, !0), MM = T("sometimesBy", function(e, t, n) {
  return K(e).fmap((r) => Te(n._degradeBy(r), t(n._undegradeBy(1 - r)))).innerJoin();
}), CM = T("sometimes", function(e, t) {
  return t._sometimesBy(0.5, e);
}), vM = T("someCyclesBy", function(e, t, n) {
  return K(e).fmap(
    (r) => Te(
      n._degradeByWith(mt._segment(1), r),
      t(n._degradeByWith(mt.fmap((i) => 1 - i)._segment(1), 1 - r))
    )
  ).innerJoin();
}), PM = T("someCycles", function(e, t) {
  return t._someCyclesBy(0.5, e);
}), DM = T("often", function(e, t) {
  return t.sometimesBy(0.75, e);
}), FM = T("rarely", function(e, t) {
  return t.sometimesBy(0.25, e);
}), EM = T("almostNever", function(e, t) {
  return t.sometimesBy(0.1, e);
}), xM = T("almostAlways", function(e, t) {
  return t.sometimesBy(0.9, e);
}), wM = T("never", function(e, t) {
  return t;
}), SM = T("always", function(e, t) {
  return e(t);
});
function qu(e) {
  Array.isArray(e) === !1 && (e = [e]);
  const t = Ec();
  return e.every((n) => {
    const r = Fc.get(n) ?? n;
    return t[r];
  });
}
const BM = T("whenKey", function(e, t, n) {
  return n.when(qu(e), t);
}), _M = T("keyDown", function(e) {
  return e.fmap(qu);
}), un = function(e, t, n = !0) {
  const r = Array.isArray(e), i = Object.keys(e).length;
  return e = Pc(e, K), i === 0 ? Be : t.fmap((s) => {
    let u = s;
    return r && (u = n ? Math.round(u) % i : Zi(Math.round(u), 0, e.length - 1)), e[u];
  });
}, Lp = function(e, t) {
  return Array.isArray(t) && ([t, e] = [e, t]), kM(e, t);
}, kM = T("pick", function(e, t) {
  return un(e, t, !1).innerJoin();
}), Rp = T("pickmod", function(e, t) {
  return un(e, t, !0).innerJoin();
}), IM = T("pickF", function(e, t, n) {
  return n.apply(Lp(e, t));
}), VM = T("pickmodF", function(e, t, n) {
  return n.apply(Rp(e, t));
}), NM = T("pickOut", function(e, t) {
  return un(e, t, !1).outerJoin();
}), TM = T("pickmodOut", function(e, t) {
  return un(e, t, !0).outerJoin();
}), LM = T("pickRestart", function(e, t) {
  return un(e, t, !1).restartJoin();
}), RM = T("pickmodRestart", function(e, t) {
  return un(e, t, !0).restartJoin();
}), GM = T("pickReset", function(e, t) {
  return un(e, t, !1).resetJoin();
}), XM = T("pickmodReset", function(e, t) {
  return un(e, t, !0).resetJoin();
}), { inhabit: ZM, pickSqueeze: WM } = T(["inhabit", "pickSqueeze"], function(e, t) {
  return un(e, t, !1).squeezeJoin();
}), { inhabitmod: OM, pickmodSqueeze: zM } = T(["inhabitmod", "pickmodSqueeze"], function(e, t) {
  return un(e, t, !0).squeezeJoin();
}), jM = (e, t) => (t = t.map(K), t.length == 0 ? Be : e.fmap((n) => {
  const r = St(Math.round(n), t.length);
  return t[r];
}).squeezeJoin());
let Si;
try {
  Si = window?.speechSynthesis;
} catch {
  console.warn("cannot use window: not in browser?");
}
let eo = Si?.getVoices();
function $M(e, t, n) {
  Si.cancel();
  const r = new SpeechSynthesisUtterance(e);
  r.lang = t, eo = Si.getVoices();
  const i = eo.filter((s) => s.lang.includes(t));
  typeof n == "number" ? r.voice = i[n % i.length] : typeof n == "string" && (r.voice = i.find((s) => s.name === s)), speechSynthesis.speak(r);
}
const qM = T("speak", function(e, t, n) {
  return n.onTrigger((r, i) => {
    $M(i.value, e, t);
  });
}), Bi = async (...e) => {
  const t = await Promise.allSettled(e), n = t.filter((r) => r.status === "fulfilled").map((r) => r.value);
  return t.forEach((r, i) => {
    r.status === "rejected" && console.warn(`evalScope: module with index ${i} could not be loaded:`, r.reason);
  }), n.forEach((r) => {
    Object.entries(r).forEach(([i, s]) => {
      globalThis[i] = s;
    });
  }), n;
};
function KM(e, t = {}) {
  const { wrapExpression: n = !0, wrapAsync: r = !0 } = t;
  n && (e = `{${e}}`), r && (e = `(async ()=>${e})()`);
  const i = `"use strict";return (${e})`;
  return Function(i)();
}
const Gp = async (e, t, n) => {
  let r = {};
  if (t) {
    const u = t(e, n);
    e = u.output, r = u;
  }
  return { mode: "javascript", pattern: await KM(e, { wrapExpression: !!t }), meta: r };
};
class HM {
  constructor({ onTrigger: t, onToggle: n, getTime: r }) {
    this.started = !1, this.cps = 0.5, this.lastTick = 0, this.getTime = r, this.time_at_last_tick_message = 0, this.collator = new Dc({ getTargetClockTime: r }), this.onToggle = n, this.latency = 0.1, this.cycle = 0, this.id = Math.round(Date.now() * Math.random()), this.worker = new SharedWorker(new URL(
      /* @vite-ignore */
      "" + new URL("assets/clockworker-ZDiUtESR.js", import.meta.url).href,
      import.meta.url
    )), this.worker.port.start(), this.channel = new BroadcastChannel("strudeltick");
    const i = (u) => {
      const { cps: a, begin: o, end: f, cycle: h, time: m } = u;
      this.cps = a, this.cycle = h;
      const p = this.collator.calculateOffset(m) + m;
      s(o, f, p), this.time_at_last_tick_message = p;
    }, s = (u, a, o) => {
      if (this.started === !1)
        return;
      this.pattern.queryArc(u, a, { _cps: this.cps }).forEach((h) => {
        if (h.hasOnset()) {
          const p = Us(h.whole.begin - this.cycle, this.cps) + o + this.latency, A = Us(h.duration, this.cps);
          t?.(h, 0, A, this.cps, p);
        }
      });
    };
    this.channel.onmessage = (u) => {
      if (!this.started)
        return;
      const { payload: a, type: o } = u.data;
      switch (o) {
        case "tick":
          i(a);
      }
    };
  }
  sendMessage(t, n) {
    this.worker.port.postMessage({ type: t, payload: n, id: this.id });
  }
  now() {
    const t = (this.getTime() - this.time_at_last_tick_message) * this.cps;
    return this.cycle + t;
  }
  setCps(t = 1) {
    this.sendMessage("cpschange", { cps: t });
  }
  setCycle(t) {
    this.sendMessage("setcycle", { cycle: t });
  }
  setStarted(t) {
    this.sendMessage("toggle", { started: t }), this.started = t, this.onToggle?.(t);
  }
  start() {
    Je("[cyclist] start"), this.setStarted(!0);
  }
  stop() {
    Je("[cyclist] stop"), this.collator.reset(), this.setStarted(!1);
  }
  setPattern(t, n = !1) {
    this.pattern = t, n && !this.started && this.start();
  }
  log(t, n, r) {
    const i = r.filter((s) => s.hasOnset());
    console.log(`${t.toFixed(4)} - ${n.toFixed(4)} ${Array(i.length).fill("I").join("")}`);
  }
}
class Xp {
  constructor({
    interval: t,
    onTrigger: n,
    onToggle: r,
    onError: i,
    getTime: s,
    latency: u = 0.1,
    setInterval: a,
    clearInterval: o,
    beforeStart: f
  }) {
    this.started = !1, this.beforeStart = f, this.cps = 0.5, this.num_ticks_since_cps_change = 0, this.lastTick = 0, this.lastBegin = 0, this.lastEnd = 0, this.getTime = s, this.num_cycles_at_cps_change = 0, this.seconds_at_cps_change, this.onToggle = r, this.latency = u, this.clock = vp(
      s,
      // called slightly before each cycle
      (h, m, p, A) => {
        this.num_ticks_since_cps_change === 0 && (this.num_cycles_at_cps_change = this.lastEnd, this.seconds_at_cps_change = h), this.num_ticks_since_cps_change++;
        const v = this.num_ticks_since_cps_change * m * this.cps;
        try {
          const E = this.lastEnd;
          this.lastBegin = E;
          const k = this.num_cycles_at_cps_change + v;
          if (this.lastEnd = k, this.lastTick = h, h < A) {
            console.log("skip query: too late");
            return;
          }
          this.pattern.queryArc(E, k, { _cps: this.cps }).forEach((G) => {
            if (G.hasOnset()) {
              const S = (G.whole.begin - this.num_cycles_at_cps_change) / this.cps + this.seconds_at_cps_change + u, x = G.duration / this.cps, B = S - h;
              n?.(G, B, x, this.cps, S), G.value.cps !== void 0 && this.cps != G.value.cps && (this.cps = G.value.cps, this.num_ticks_since_cps_change = 0);
            }
          });
        } catch (E) {
          Je(`[cyclist] error: ${E.message}`), i?.(E);
        }
      },
      t,
      // duration of each cycle
      0.1,
      0.1,
      a,
      o
    );
  }
  now() {
    if (!this.started)
      return 0;
    const t = this.getTime() - this.lastTick - this.clock.duration;
    return this.lastBegin + t * this.cps;
  }
  setStarted(t) {
    this.started = t, this.onToggle?.(t);
  }
  async start() {
    if (await this.beforeStart?.(), this.num_ticks_since_cps_change = 0, this.num_cycles_at_cps_change = 0, !this.pattern)
      throw new Error("Scheduler: no pattern set! call .setPattern first.");
    Je("[cyclist] start"), this.clock.start(), this.setStarted(!0);
  }
  pause() {
    Je("[cyclist] pause"), this.clock.pause(), this.setStarted(!1);
  }
  stop() {
    Je("[cyclist] stop"), this.clock.stop(), this.lastEnd = 0, this.setStarted(!1);
  }
  async setPattern(t, n = !1) {
    this.pattern = t, n && !this.started && await this.start();
  }
  setCps(t = 0.5) {
    this.cps !== t && (this.cps = t, this.num_ticks_since_cps_change = 0);
  }
  log(t, n, r) {
    const i = r.filter((s) => s.hasOnset());
    console.log(`${t.toFixed(4)} - ${n.toFixed(4)} ${Array(i.length).fill("I").join("")}`);
  }
}
let su;
function uu() {
  if (!su)
    throw new Error("no time set! use setTime to define a time source");
  return su();
}
function _i(e) {
  su = e;
}
function JM({
  defaultOutput: e,
  onEvalError: t,
  beforeEval: n,
  beforeStart: r,
  afterEval: i,
  getTime: s,
  transpiler: u,
  onToggle: a,
  editPattern: o,
  onUpdateState: f,
  sync: h = !1,
  setInterval: m,
  clearInterval: p,
  id: A
}) {
  const M = {
    schedulerError: void 0,
    evalError: void 0,
    code: "// LOADING",
    activeCode: "// LOADING",
    pattern: void 0,
    miniLocations: [],
    widgets: [],
    pending: !1,
    started: !1
  }, v = {
    id: A
  }, E = (oe) => {
    Object.assign(M, oe), M.isDirty = M.code !== M.activeCode, M.error = M.evalError || M.schedulerError, f?.(M);
  }, k = {
    onTrigger: Zp({ defaultOutput: e, getTime: s }),
    getTime: s,
    onToggle: (oe) => {
      E({ started: oe }), a?.(oe);
    },
    setInterval: m,
    clearInterval: p,
    beforeStart: r
  }, _ = h && typeof SharedWorker < "u" ? new HM(k) : new Xp(k);
  let G = {}, S = 0, x, B;
  const I = function() {
    return G = {}, S = 0, x = void 0, B = void 0, Be;
  }, V = async (oe, ge = !0) => (oe = o?.(oe) || oe, await _.setPattern(oe, ge), oe);
  _i(() => _.now());
  const q = () => _.stop(), X = () => _.start(), U = () => _.pause(), O = () => _.toggle(), W = (oe) => _.setCps(oe), ee = (oe) => _.setCps(oe / 60), be = function(oe) {
    return x = oe, Be;
  }, pe = function(oe) {
    return B = oe, Be;
  }, le = () => {
    z.prototype.p = function(ge) {
      return typeof ge == "string" && (ge.startsWith("_") || ge.endsWith("_")) ? Be : (ge === "$" && (ge = `$${S}`, S++), G[ge] = this, this);
    }, z.prototype.q = function(ge) {
      return Be;
    };
    try {
      for (let ge = 1; ge < 10; ++ge)
        Object.defineProperty(z.prototype, `d${ge}`, {
          get() {
            return this.p(ge);
          },
          configurable: !0
        }), Object.defineProperty(z.prototype, `p${ge}`, {
          get() {
            return this.p(ge);
          },
          configurable: !0
        }), z.prototype[`q${ge}`] = Be;
    } catch (ge) {
      console.warn("injectPatternMethods: error:", ge);
    }
    const oe = T("cpm", function(ge, $) {
      return $._fast(ge / 60 / _.cps);
    });
    return Bi({
      all: be,
      each: pe,
      hush: I,
      cpm: oe,
      setCps: W,
      setcps: W,
      setCpm: ee,
      setcpm: ee
    });
  };
  return { scheduler: _, evaluate: async (oe, ge = !0, $ = !0) => {
    if (!oe)
      throw new Error("no code to evaluate");
    try {
      E({ code: oe, pending: !0 }), await le(), _i(() => _.now()), await n?.({ code: oe }), $ && I();
      let { pattern: Pe, meta: it } = await Gp(oe, u, v);
      if (Object.keys(G).length) {
        let ze = Object.values(G);
        B && (ze = ze.map((Ae) => B(Ae))), Pe = Te(...ze);
      } else B && (Pe = B(Pe));
      if (x && (Pe = x(Pe)), !wu(Pe)) {
        const ze = `got "${typeof evaluated}" instead of pattern`;
        throw new Error(ze + (typeof evaluated == "function" ? ", did you forget to call a function?" : "."));
      }
      return Je("[eval] code updated"), Pe = await V(Pe, ge), E({
        miniLocations: it?.miniLocations || [],
        widgets: it?.widgets || [],
        activeCode: oe,
        pattern: Pe,
        evalError: void 0,
        schedulerError: void 0,
        pending: !1
      }), i?.({ code: oe, pattern: Pe, meta: it }), Pe;
    } catch (Pe) {
      Je(`[eval] error: ${Pe.message}`, "error"), console.error(Pe), E({ evalError: Pe, pending: !1 }), t?.(Pe);
    }
  }, start: X, stop: q, pause: U, setCps: W, setPattern: V, setCode: (oe) => E({ code: oe }), toggle: O, state: M };
}
const Zp = ({ getTime: e, defaultOutput: t }) => async (n, r, i, s, u) => {
  try {
    (!n.context.onTrigger || !n.context.dominantTrigger) && await t(n, r, i, s, u), n.context.onTrigger && await n.context.onTrigger(e() + r, n, e(), s, u);
  } catch (a) {
    Je(`[cyclist] error: ${a.message}`, "error");
  }
}, YM = function(e, t = {}) {
  const n = document.getElementById("code"), r = "background-image:url(" + e + ");background-size:contain;";
  n.style = r;
  const { className: i } = n, s = (o, f) => {
    ({
      style: () => n.style = r + ";" + f,
      className: () => n.className = f + " " + i
    })[o]();
  }, u = Object.entries(t).filter(([o, f]) => typeof f == "function");
  Object.entries(t).filter(([o, f]) => typeof f == "string").forEach(([o, f]) => s(o, f)), u.length;
}, UM = () => {
  const e = document.getElementById("code");
  e && (e.style = "");
};
Je("🌀 @strudel/core loaded 🌀");
globalThis._strudelLoaded && console.warn(
  `@strudel/core was loaded more than once...
This might happen when you have multiple versions of strudel installed. 
Please check with "npm ls @strudel/core".`
);
globalThis._strudelLoaded = !0;
const Wp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ClockCollator: Dc,
  Cyclist: Xp,
  Fraction: j,
  Hap: $e,
  Pattern: z,
  State: pr,
  TimeSpan: He,
  __chooseWith: ju,
  _brandBy: Ou,
  _fitslice: Lc,
  _irand: zu,
  _keyDown: qu,
  _match: Rc,
  _mod: St,
  _polymeterListSteps: Xc,
  _retime: tu,
  _slices: nu,
  accelerate: ul,
  activeLabel: zf,
  ad: Y1,
  add: y3,
  adsr: J1,
  almostAlways: xM,
  almostNever: EM,
  always: SM,
  amp: ll,
  analyze: Pl,
  anchor: mh,
  and: T3,
  apply: hb,
  ar: Q1,
  arrange: n3,
  as: yp,
  att: hl,
  attack: fl,
  averageArray: pc,
  backgroundImage: YM,
  band: P3,
  bandf: kl,
  bandq: Nl,
  bank: vl,
  base64ToUnicode: vc,
  bbexpr: Kl,
  bbst: Jl,
  beat: _A,
  begin: Ll,
  binary: nM,
  binaryN: Bp,
  bind: o3,
  binshift: A1,
  bite: bb,
  bjork: Mp,
  blshift: E3,
  bor: D3,
  bp: Vl,
  bpa: S0,
  bpattack: w0,
  bpd: N0,
  bpdecay: V0,
  bpe: P0,
  bpenv: v0,
  bpf: Il,
  bpq: Tl,
  bpr: q0,
  bprelease: $0,
  bps: Z0,
  bpsustain: X0,
  brak: wb,
  brand: aM,
  brandBy: uM,
  brshift: x3,
  bxor: F3,
  bypass: Ub,
  byteBeatExpression: ql,
  byteBeatStartTime: Hl,
  calculateSteps: Ky,
  cat: Ic,
  ccn: sp,
  ccv: up,
  ceil: Z3,
  ch: Ul,
  channel: h0,
  channels: Yl,
  choose: cM,
  chooseCycles: Ip,
  chooseInWith: $u,
  chooseWith: ji,
  chop: CA,
  chord: hh,
  chunk: jb,
  chunkBack: Kb,
  chunkback: Hb,
  clamp: Zi,
  cleanupUi: UM,
  clip: _1,
  coarse: jl,
  code2hash: Wy,
  color: K1,
  colour: H1,
  comb: g1,
  compose: By,
  compress: K3,
  compressSpan: H3,
  compressor: Nh,
  compressorAttack: Rh,
  compressorKnee: Th,
  compressorRatio: Lh,
  compressorRelease: Gh,
  compressspan: J3,
  constant: _y,
  contract: $c,
  control: ip,
  controls: IA,
  cosine: WA,
  cosine2: OA,
  cpm: pb,
  cps: B1,
  createClock: vp,
  createParam: Oi,
  createParams: Nu,
  crush: zl,
  ctf: m0,
  ctlNum: ap,
  ctranspose: Kf,
  curry: me,
  curve: T1,
  cut: p0,
  cutoff: d0,
  cycleToSeconds: Us,
  dec: El,
  decay: Fl,
  degrade: yM,
  degradeBy: gM,
  degradeByWith: mM,
  degree: $f,
  delay: ff,
  delayfb: pf,
  delayfeedback: hf,
  delayt: gf,
  delaytime: mf,
  deltaSlide: L1,
  det: Mf,
  detune: Af,
  dfb: df,
  dict: dh,
  dictionary: ph,
  dist: Vh,
  distort: Ih,
  div: M3,
  djf: lf,
  drawLine: xc,
  drive: $l,
  drop: Oc,
  dry: Pf,
  ds: U1,
  dt: yf,
  dur: V1,
  duration: I1,
  early: db,
  echo: Gb,
  echoWith: Nb,
  echowith: Tb,
  end: Rl,
  enhance: d1,
  eq: k3,
  eqt: I3,
  euclid: TA,
  euclidLegato: GA,
  euclidLegatoRot: XA,
  euclidRot: RA,
  euclidrot: LA,
  evalScope: Bi,
  evaluate: Gp,
  every: fb,
  expand: jc,
  expression: jh,
  extend: zc,
  fadeInTime: Ef,
  fadeOutTime: Ff,
  fadeTime: Df,
  fanchor: H0,
  fast: rb,
  fastChunk: Yb,
  fastGap: Y3,
  fastcat: gt,
  fastchunk: Jb,
  fastgap: U3,
  fft: Dl,
  filter: rA,
  filterWhen: iA,
  firstOf: lb,
  fit: EA,
  flatten: An,
  floor: X3,
  fm: ml,
  fmattack: yl,
  fmdecay: bl,
  fmenv: gl,
  fmh: pl,
  fmi: dl,
  fmrelease: Ml,
  fmsustain: Al,
  fmvelocity: Cl,
  focus: Q3,
  focusSpan: eb,
  focusspan: tb,
  fractionalArgs: ky,
  frameRate: v1,
  frames: P1,
  freeze: c1,
  freq: xf,
  freqToMidi: vu,
  fromBipolar: O3,
  fshift: Yh,
  fshiftnote: Uh,
  fshiftphase: Qh,
  ftype: K0,
  func: R3,
  gain: ol,
  gap: Mr,
  gat: Xf,
  gate: Gf,
  getControlName: Tu,
  getCurrentKeyboardState: Ec,
  getEventOffsetMs: Fy,
  getFreq: hc,
  getFrequency: mc,
  getPerformanceTimeSeconds: zy,
  getPlayableNoteValue: Sy,
  getSoundIndex: wy,
  getTime: uu,
  getTrigger: Zp,
  grow: uA,
  gt: S3,
  gte: _3,
  harmonic: Hf,
  hash2code: Oy,
  hbrick: M1,
  hcutoff: nf,
  hold: _l,
  hours: D1,
  hp: sf,
  hpa: x0,
  hpattack: E0,
  hpd: I0,
  hpdecay: k0,
  hpe: C0,
  hpenv: M0,
  hpf: rf,
  hpq: af,
  hpr: j0,
  hprelease: z0,
  hps: G0,
  hpsustain: R0,
  hresonance: uf,
  hsl: nA,
  hsla: tA,
  hurry: ib,
  id: cr,
  imag: p1,
  inhabit: ZM,
  inhabitmod: OM,
  innerBind: c3,
  inside: ab,
  inv: Fb,
  invert: Db,
  ir: Eh,
  irand: oM,
  iresponse: xh,
  isNote: Un,
  isNoteWithOctave: Cy,
  isPattern: wu,
  isaw: zi,
  isaw2: Gu,
  iter: Zb,
  iterBack: Wb,
  iterback: Ob,
  itri: qA,
  itri2: KA,
  jux: Vb,
  juxBy: kb,
  juxby: Ib,
  kcutoff: n1,
  keep: m3,
  keepif: g3,
  keyAlias: Fc,
  keyDown: _M,
  krush: t1,
  label: jf,
  lastOf: cb,
  late: Nc,
  lbrick: C1,
  legato: k1,
  leslie: Zf,
  lfo: X1,
  linger: Ab,
  listRange: Pu,
  lock: bf,
  logKey: Cu,
  logger: Je,
  loop: Gl,
  loopAt: DA,
  loopAtCps: xA,
  loopBegin: Xl,
  loopEnd: Wl,
  loopat: FA,
  loopatcps: wA,
  loopb: Zl,
  loope: Ol,
  lp: y0,
  lpa: F0,
  lpattack: D0,
  lpd: _0,
  lpdecay: B0,
  lpe: A0,
  lpenv: b0,
  lpf: g0,
  lpq: cf,
  lpr: O0,
  lprelease: W0,
  lps: L0,
  lpsustain: T0,
  lrate: Wf,
  lsize: Of,
  lt: w3,
  lte: B3,
  mapArgs: Fu,
  mask: i3,
  midi2note: xy,
  midiToFreq: Hn,
  midibend: dp,
  midichan: ep,
  midicmd: rp,
  midimap: tp,
  midiport: np,
  miditouch: mp,
  minutes: F1,
  mod: C3,
  mode: bh,
  mouseX: UA,
  mouseY: JA,
  mousex: YA,
  mousey: HA,
  mtranspose: qf,
  mul: A3,
  n: il,
  nanFallback: dc,
  ne: V3,
  net: N3,
  never: wM,
  noise: Q0,
  note: sl,
  noteToMidi: Rn,
  nothing: Mt,
  nrpnn: op,
  nrpv: cp,
  nudge: Uf,
  numeralArgs: At,
  objectMap: Pc,
  octave: Qf,
  octaveR: Yf,
  octaves: yh,
  octer: r1,
  octersub: i1,
  octersubsub: s1,
  off: xb,
  offset: gh,
  often: DM,
  or: L3,
  orbit: eh,
  outerBind: l3,
  outside: ob,
  overgain: th,
  overshape: nh,
  pace: Gc,
  pairs: Ac,
  palindrome: _b,
  pan: rh,
  panchor: Rf,
  panorient: ah,
  panspan: ih,
  pansplay: sh,
  panwidth: uh,
  parseFractional: bc,
  parseNumeral: Du,
  partials: m1,
  patt: Sf,
  pattack: wf,
  pcurve: Lf,
  pdec: _f,
  pdecay: Bf,
  penv: Tf,
  perlin: dM,
  perlinWith: Tp,
  ph: r0,
  phasdp: f0,
  phaser: i0,
  phasercenter: a0,
  phaserdepth: c0,
  phaserrate: n0,
  phasersweep: s0,
  phc: o0,
  phd: l0,
  phs: u0,
  pick: Lp,
  pickF: IM,
  pickOut: NM,
  pickReset: GM,
  pickRestart: LM,
  pickSqueeze: WM,
  pickmod: Rp,
  pickmodF: VM,
  pickmodOut: TM,
  pickmodReset: XM,
  pickmodRestart: RM,
  pickmodSqueeze: zM,
  pipe: yc,
  pitchJump: R1,
  pitchJumpTime: G1,
  ply: nb,
  pm: e3,
  polyBind: p3,
  polyTouch: gp,
  polymeter: Wi,
  polyrhythm: Uy,
  postgain: cl,
  pow: v3,
  pr: Qy,
  prel: Nf,
  prelease: Vf,
  press: Bb,
  pressBy: Sb,
  progNum: lp,
  psus: If,
  psustain: kf,
  pure: Ye,
  pw: Ql,
  pwrate: e0,
  pwsweep: t0,
  rand: mt,
  rand2: sM,
  randcat: lM,
  randrun: _p,
  range: z3,
  range2: $3,
  rangex: j3,
  rarely: FM,
  rate: oh,
  ratio: q3,
  rdim: Ph,
  real: h1,
  ref: SA,
  register: T,
  registerControl: w,
  reify: K,
  rel: Bl,
  release: Sl,
  removeUndefineds: Ar,
  repeatCycles: zb,
  repeatTime: Z1,
  repl: JM,
  resonance: of,
  rev: Tc,
  rfade: Fh,
  rib: eA,
  ribbon: Qb,
  ring: u1,
  ringdf: o1,
  ringf: a1,
  rlp: Ch,
  room: Ah,
  roomdim: vh,
  roomfade: Dh,
  roomlp: Mh,
  roomsize: wh,
  rotate: gc,
  round: G3,
  rsize: _h,
  run: Sp,
  s: el,
  s_add: pA,
  s_alt: cA,
  s_cat: oA,
  s_contract: yA,
  s_expand: mA,
  s_extend: gA,
  s_polymeter: lA,
  s_sub: dA,
  s_taper: fA,
  s_taperlist: hA,
  s_tour: bA,
  s_zip: AA,
  saw: ni,
  saw2: Ru,
  scram: b1,
  scramble: iM,
  scrub: bp,
  seconds: E1,
  seg: Cb,
  segment: Mb,
  semitone: lh,
  seq: Vc,
  seqPLoop: r3,
  sequence: Bt,
  sequenceP: Sc,
  set: d3,
  setStringParser: wc,
  setTime: _i,
  shape: kh,
  shrink: Kc,
  shrinklist: qc,
  shuffle: rM,
  signal: _t,
  silence: Be,
  sine: Pp,
  sine2: Xu,
  size: Sh,
  slice: Uc,
  slide: ch,
  slow: sb,
  slowChunk: qb,
  slowcat: Gn,
  slowcatPrime: Bu,
  slowchunk: $b,
  smear: y1,
  sol2note: Gy,
  someCycles: PM,
  someCyclesBy: vM,
  sometimes: CM,
  sometimesBy: MM,
  songPtr: x1,
  sound: tl,
  source: nl,
  sparsity: ub,
  speak: qM,
  speed: Vu,
  splice: PA,
  splitAt: Eu,
  spread: vf,
  square: Dp,
  square2: zA,
  squeeze: jM,
  squeezeBind: f3,
  squiz: Wh,
  src: rl,
  stack: Te,
  stackBy: t3,
  stackCentre: kc,
  stackLeft: Bc,
  stackRight: _c,
  steady: ZA,
  stepBind: h3,
  stepalt: Zc,
  stepcat: dt,
  steps: MA,
  stepsPerOctave: Jf,
  stretch: Xh,
  striate: vA,
  struct: s3,
  stut: Xb,
  stutWith: Lb,
  stutwith: Rb,
  sub: b3,
  superimpose: u3,
  sus: wl,
  sustain: xl,
  sustainpedal: $h,
  swing: Pb,
  swingBy: vb,
  sysex: fp,
  sysexdata: pp,
  sysexid: hp,
  sz: Bh,
  take: Wc,
  time: Fp,
  timeCat: Iu,
  timecat: aA,
  toBipolar: W3,
  tokenizeNote: fc,
  tour: Hc,
  tremdp: Kh,
  tremolo: $1,
  tremolodepth: qh,
  tremolorate: Hh,
  tremr: Jh,
  tri: jA,
  tri2: $A,
  triode: e1,
  tsdelay: f1,
  uid: w1,
  undegrade: AM,
  undegradeBy: bM,
  unicodeToBase64: Cc,
  uniq: Xy,
  uniqsort: Zy,
  uniqsortr: Mc,
  unison: Cf,
  unit: Zh,
  v: U0,
  val: S1,
  valueToMidi: Dy,
  velocity: al,
  vib: J0,
  vibmod: ef,
  vibrato: Y0,
  vmod: tf,
  voice: fh,
  vowel: Oh,
  waveloss: zh,
  wchoose: hM,
  wchooseCycles: Np,
  when: Eb,
  whenKey: BM,
  withValue: a3,
  within: sA,
  wrandcat: pM,
  xfade: Qc,
  xsdelay: l1,
  zcrush: z1,
  zdelay: j1,
  zip: Jc,
  zipWith: xu,
  zmod: O1,
  znoise: W1,
  zoom: mb,
  zoomArc: gb,
  zoomarc: yb,
  zrand: N1,
  zzfx: q1
}, Symbol.toStringTag, { value: "Module" }));
if (typeof DelayNode < "u") {
  class e extends DelayNode {
    constructor(n, r, i, s) {
      super(n), r = Math.abs(r), this.delayTime.value = i;
      const u = n.createGain();
      u.gain.value = Math.min(Math.abs(s), 0.995), this.feedback = u.gain;
      const a = n.createGain();
      return a.gain.value = r, this.delayGain = a, this.connect(u), this.connect(a), u.connect(this), this.connect = (o) => a.connect(o), this;
    }
    start(n) {
      this.delayGain.gain.setValueAtTime(this.delayGain.gain.value, n + this.delayTime.value);
    }
  }
  AudioContext.prototype.createFeedbackDelay = function(t, n, r) {
    return new e(this, t, n, r);
  };
}
var Ku = {};
Ku.generateReverb = function(e, t) {
  for (var n = e.audioContext || new AudioContext(), r = n.sampleRate, i = e.numChannels || 2, s = e.decayTime * 1.5, u = Math.round(e.decayTime * r), a = Math.round(s * r), o = Math.round((e.fadeInTime || 0) * r), f = Math.pow(1 / 1e3, 1 / u), h = n.createBuffer(i, a, r), m = 0; m < i; m++) {
    for (var p = h.getChannelData(m), A = 0; A < a; A++)
      p[A] = tC() * Math.pow(f, A);
    for (var A = 0; A < o; A++)
      p[A] *= A / o;
  }
  QM(h, e.lpFreqStart || 0, e.lpFreqEnd || 0, e.decayTime, t);
};
Ku.generateGraph = function(e, t, n, r, i) {
  var s = document.createElement("canvas");
  s.width = t, s.height = n;
  var u = s.getContext("2d");
  u.fillStyle = "#000", u.fillRect(0, 0, s.width, s.height), u.fillStyle = "#fff";
  for (var a = t / e.length, o = n / (i - r), f = 0; f < e.length; f++)
    u.fillRect(f * a, n - (e[f] - r) * o, 1, 1);
  return s;
};
var QM = function(e, t, n, r, i) {
  if (t == 0) {
    i(e);
    return;
  }
  var s = eC(e), u = new OfflineAudioContext(e.numberOfChannels, s[0].length, e.sampleRate), a = u.createBufferSource();
  a.buffer = e;
  var o = u.createBiquadFilter();
  t = Math.min(t, e.sampleRate / 2), n = Math.min(n, e.sampleRate / 2), o.type = "lowpass", o.Q.value = 1e-4, o.frequency.setValueAtTime(t, 0), o.frequency.linearRampToValueAtTime(n, r), a.connect(o), o.connect(u.destination), a.start(), u.oncomplete = function(f) {
    i(f.renderedBuffer);
  }, u.startRendering(), window.filterNode = o;
}, eC = function(e) {
  for (var t = [], n = 0; n < e.numberOfChannels; n++)
    t[n] = e.getChannelData(n);
  return t;
}, tC = function() {
  return Math.random() * 2 - 1;
};
typeof AudioContext < "u" && (AudioContext.prototype.adjustLength = function(e, t) {
  const n = t.sampleRate * e, r = this.createBuffer(t.numberOfChannels, t.length, t.sampleRate);
  for (let i = 0; i < t.numberOfChannels; i++) {
    let s = t.getChannelData(i), u = r.getChannelData(i);
    for (let a = 0; a < n; a++)
      u[a] = s[a] || 0;
  }
  return r;
}, AudioContext.prototype.createReverb = function(e, t, n, r, i) {
  const s = this.createConvolver();
  return s.generate = (u = 2, a = 0.1, o = 15e3, f = 1e3, h) => {
    s.duration = u, s.fade = a, s.lp = o, s.dim = f, s.ir = h, h ? s.buffer = this.adjustLength(u, h) : Ku.generateReverb(
      {
        audioContext: this,
        numChannels: 2,
        decayTime: u,
        fadeInTime: a,
        lpFreqStart: o,
        lpFreqEnd: f
      },
      (m) => {
        s.buffer = m;
      }
    );
  }, s.generate(e, t, n, r, i), s;
});
var to = {
  a: { freqs: [660, 1120, 2750, 3e3, 3350], gains: [1, 0.5012, 0.0708, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  e: { freqs: [440, 1800, 2700, 3e3, 3300], gains: [1, 0.1995, 0.1259, 0.1, 0.1], qs: [70, 80, 100, 120, 120] },
  i: { freqs: [270, 1850, 2900, 3350, 3590], gains: [1, 0.0631, 0.0631, 0.0158, 0.0158], qs: [40, 90, 100, 120, 120] },
  o: { freqs: [430, 820, 2700, 3e3, 3300], gains: [1, 0.3162, 0.0501, 0.0794, 0.01995], qs: [40, 80, 100, 120, 120] },
  u: { freqs: [370, 630, 2750, 3e3, 3400], gains: [1, 0.1, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  ae: { freqs: [650, 1515, 2400, 3e3, 3350], gains: [1, 0.5, 0.1008, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  aa: { freqs: [560, 900, 2570, 3e3, 3300], gains: [1, 0.5, 0.0708, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  oe: { freqs: [500, 1430, 2300, 3e3, 3300], gains: [1, 0.2, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  ue: { freqs: [250, 1750, 2150, 3200, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  y: { freqs: [400, 1460, 2400, 3e3, 3300], gains: [1, 0.2, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  uh: { freqs: [600, 1250, 2100, 3100, 3500], gains: [1, 0.3, 0.0608, 0.0316, 0.01995], qs: [40, 70, 100, 120, 130] },
  un: { freqs: [500, 1240, 2280, 3e3, 3500], gains: [1, 0.1, 0.1708, 0.0216, 0.02995], qs: [40, 60, 100, 120, 120] },
  en: { freqs: [600, 1480, 2450, 3200, 3300], gains: [1, 0.15, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  an: { freqs: [700, 1050, 2500, 3e3, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  on: { freqs: [500, 1080, 2350, 3e3, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  get æ() {
    return this.ae;
  },
  get ø() {
    return this.oe;
  },
  get ɑ() {
    return this.aa;
  },
  get å() {
    return this.aa;
  },
  get ö() {
    return this.oe;
  },
  get ü() {
    return this.ue;
  },
  get ı() {
    return this.y;
  }
};
if (typeof GainNode < "u") {
  class e extends GainNode {
    constructor(n, r) {
      if (super(n), !to[r])
        throw new Error("vowel: unknown vowel " + r);
      const { gains: i, qs: s, freqs: u } = to[r], a = n.createGain();
      for (let o = 0; o < 5; o++) {
        const f = n.createGain();
        f.gain.value = i[o];
        const h = n.createBiquadFilter();
        h.type = "bandpass", h.Q.value = s[o], h.frequency.value = u[o], this.connect(h), h.connect(f), f.connect(a);
      }
      return a.gain.value = 8, this.connect = (o) => a.connect(o), this;
    }
  }
  AudioContext.prototype.createVowelFilter = function(t) {
    return new e(this, t);
  };
}
let Op = (e) => console.log(e);
const xt = (...e) => Op(...e), zp = (e) => {
  Op = e;
}, nC = (e) => {
  if (typeof e != "string")
    return [];
  const [t, n = "", r] = e.match(/^([a-gA-G])([#bsf]*)([0-9]*)$/)?.slice(1) || [];
  return t ? [t, n, r ? Number(r) : void 0] : [];
}, rC = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, iC = { "#": 1, b: -1, s: 1, f: -1 }, $i = (e, t = 3) => {
  const [n, r, i = t] = nC(e);
  if (!n)
    throw new Error('not a note: "' + e + '"');
  const s = rC[n.toLowerCase()], u = r?.split("").reduce((a, o) => a + iC[o], 0) || 0;
  return (Number(i) + 1) * 12 + s + u;
}, jp = (e) => Math.pow(2, (e - 69) / 12) * 440, Jr = (e, t, n) => Math.min(Math.max(e, t), n), sC = (e) => 12 * Math.log(e / 440) / Math.LN2 + 69, uC = (e, t) => {
  if (typeof e != "object")
    throw new Error("valueToMidi: expected object value");
  let { freq: n, note: r } = e;
  return typeof n == "number" ? sC(n) : typeof r == "string" ? $i(r) : typeof r == "number" ? r : t;
};
function Mn(e, t = 0, n) {
  return isNaN(Number(e)) ? (!n && xt(`"${e}" is not a number, falling back to ${t}`, "warning"), t) : e;
}
const $p = (e, t) => (e % t + t) % t, no = (e, t) => $p(Math.round(Mn(e, 0)), t), aC = "data:text/javascript;base64,KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NsYXNzIHZ0IGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKHQpe3N1cGVyKHQpLHRoaXMuc3RhcnRlZD0hMSx0aGlzLm5iSW5wdXRzPXQubnVtYmVyT2ZJbnB1dHMsdGhpcy5uYk91dHB1dHM9dC5udW1iZXJPZk91dHB1dHMsdGhpcy5ibG9ja1NpemU9dC5wcm9jZXNzb3JPcHRpb25zLmJsb2NrU2l6ZSx0aGlzLmhvcFNpemU9MTI4LHRoaXMubmJPdmVybGFwcz10aGlzLmJsb2NrU2l6ZS90aGlzLmhvcFNpemUsdGhpcy5pbnB1dEJ1ZmZlcnM9bmV3IEFycmF5KHRoaXMubmJJbnB1dHMpLHRoaXMuaW5wdXRCdWZmZXJzSGVhZD1uZXcgQXJyYXkodGhpcy5uYklucHV0cyksdGhpcy5pbnB1dEJ1ZmZlcnNUb1NlbmQ9bmV3IEFycmF5KHRoaXMubmJJbnB1dHMpO2ZvcihsZXQgZT0wO2U8dGhpcy5uYklucHV0cztlKyspdGhpcy5hbGxvY2F0ZUlucHV0Q2hhbm5lbHMoZSwxKTt0aGlzLm91dHB1dEJ1ZmZlcnM9bmV3IEFycmF5KHRoaXMubmJPdXRwdXRzKSx0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlPW5ldyBBcnJheSh0aGlzLm5iT3V0cHV0cyk7Zm9yKGxldCBlPTA7ZTx0aGlzLm5iT3V0cHV0cztlKyspdGhpcy5hbGxvY2F0ZU91dHB1dENoYW5uZWxzKGUsMSl9cmVhbGxvY2F0ZUNoYW5uZWxzSWZOZWVkZWQodCxlKXtmb3IobGV0IHM9MDtzPHRoaXMubmJJbnB1dHM7cysrKXtsZXQgcj10W3NdLmxlbmd0aDtyIT10aGlzLmlucHV0QnVmZmVyc1tzXS5sZW5ndGgmJnRoaXMuYWxsb2NhdGVJbnB1dENoYW5uZWxzKHMscil9Zm9yKGxldCBzPTA7czx0aGlzLm5iT3V0cHV0cztzKyspe2xldCByPWVbc10ubGVuZ3RoO3IhPXRoaXMub3V0cHV0QnVmZmVyc1tzXS5sZW5ndGgmJnRoaXMuYWxsb2NhdGVPdXRwdXRDaGFubmVscyhzLHIpfX1hbGxvY2F0ZUlucHV0Q2hhbm5lbHModCxlKXt0aGlzLmlucHV0QnVmZmVyc1t0XT1uZXcgQXJyYXkoZSk7Zm9yKGxldCBzPTA7czxlO3MrKyl0aGlzLmlucHV0QnVmZmVyc1t0XVtzXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKzEyOCksdGhpcy5pbnB1dEJ1ZmZlcnNbdF1bc10uZmlsbCgwKTt0aGlzLmlucHV0QnVmZmVyc0hlYWRbdF09bmV3IEFycmF5KGUpLHRoaXMuaW5wdXRCdWZmZXJzVG9TZW5kW3RdPW5ldyBBcnJheShlKTtmb3IobGV0IHM9MDtzPGU7cysrKXRoaXMuaW5wdXRCdWZmZXJzSGVhZFt0XVtzXT10aGlzLmlucHV0QnVmZmVyc1t0XVtzXS5zdWJhcnJheSgwLHRoaXMuYmxvY2tTaXplKSx0aGlzLmlucHV0QnVmZmVyc1RvU2VuZFt0XVtzXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKX1hbGxvY2F0ZU91dHB1dENoYW5uZWxzKHQsZSl7dGhpcy5vdXRwdXRCdWZmZXJzW3RdPW5ldyBBcnJheShlKTtmb3IobGV0IHM9MDtzPGU7cysrKXRoaXMub3V0cHV0QnVmZmVyc1t0XVtzXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKSx0aGlzLm91dHB1dEJ1ZmZlcnNbdF1bc10uZmlsbCgwKTt0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlW3RdPW5ldyBBcnJheShlKTtmb3IobGV0IHM9MDtzPGU7cysrKXRoaXMub3V0cHV0QnVmZmVyc1RvUmV0cmlldmVbdF1bc109bmV3IEZsb2F0MzJBcnJheSh0aGlzLmJsb2NrU2l6ZSksdGhpcy5vdXRwdXRCdWZmZXJzVG9SZXRyaWV2ZVt0XVtzXS5maWxsKDApfXJlYWRJbnB1dHModCl7aWYodFswXS5sZW5ndGgmJnRbMF1bMF0ubGVuZ3RoPT0wKXtmb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbZV0ubGVuZ3RoO3MrKyl0aGlzLmlucHV0QnVmZmVyc1tlXVtzXS5maWxsKDAsdGhpcy5ibG9ja1NpemUpO3JldHVybn1mb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbZV0ubGVuZ3RoO3MrKyl7bGV0IHI9dFtlXVtzXTt0aGlzLmlucHV0QnVmZmVyc1tlXVtzXS5zZXQocix0aGlzLmJsb2NrU2l6ZSl9fXdyaXRlT3V0cHV0cyh0KXtmb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbZV0ubGVuZ3RoO3MrKyl7bGV0IHI9dGhpcy5vdXRwdXRCdWZmZXJzW2VdW3NdLnN1YmFycmF5KDAsMTI4KTt0W2VdW3NdLnNldChyKX19c2hpZnRJbnB1dEJ1ZmZlcnMoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJJbnB1dHM7dCsrKWZvcihsZXQgZT0wO2U8dGhpcy5pbnB1dEJ1ZmZlcnNbdF0ubGVuZ3RoO2UrKyl0aGlzLmlucHV0QnVmZmVyc1t0XVtlXS5jb3B5V2l0aGluKDAsMTI4KX1zaGlmdE91dHB1dEJ1ZmZlcnMoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJPdXRwdXRzO3QrKylmb3IobGV0IGU9MDtlPHRoaXMub3V0cHV0QnVmZmVyc1t0XS5sZW5ndGg7ZSsrKXRoaXMub3V0cHV0QnVmZmVyc1t0XVtlXS5jb3B5V2l0aGluKDAsMTI4KSx0aGlzLm91dHB1dEJ1ZmZlcnNbdF1bZV0uc3ViYXJyYXkodGhpcy5ibG9ja1NpemUtMTI4KS5maWxsKDApfXByZXBhcmVJbnB1dEJ1ZmZlcnNUb1NlbmQoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJJbnB1dHM7dCsrKWZvcihsZXQgZT0wO2U8dGhpcy5pbnB1dEJ1ZmZlcnNbdF0ubGVuZ3RoO2UrKyl0aGlzLmlucHV0QnVmZmVyc1RvU2VuZFt0XVtlXS5zZXQodGhpcy5pbnB1dEJ1ZmZlcnNIZWFkW3RdW2VdKX1oYW5kbGVPdXRwdXRCdWZmZXJzVG9SZXRyaWV2ZSgpe2ZvcihsZXQgdD0wO3Q8dGhpcy5uYk91dHB1dHM7dCsrKWZvcihsZXQgZT0wO2U8dGhpcy5vdXRwdXRCdWZmZXJzW3RdLmxlbmd0aDtlKyspZm9yKGxldCBzPTA7czx0aGlzLmJsb2NrU2l6ZTtzKyspdGhpcy5vdXRwdXRCdWZmZXJzW3RdW2VdW3NdKz10aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlW3RdW2VdW3NdL3RoaXMubmJPdmVybGFwc31wcm9jZXNzKHQsZSxzKXtjb25zdCBuPXRbMF1bMF0hPT12b2lkIDA7cmV0dXJuIHRoaXMuc3RhcnRlZCYmIW4/ITE6KHRoaXMuc3RhcnRlZD1uLHRoaXMucmVhbGxvY2F0ZUNoYW5uZWxzSWZOZWVkZWQodCxlKSx0aGlzLnJlYWRJbnB1dHModCksdGhpcy5zaGlmdElucHV0QnVmZmVycygpLHRoaXMucHJlcGFyZUlucHV0QnVmZmVyc1RvU2VuZCgpLHRoaXMucHJvY2Vzc09MQSh0aGlzLmlucHV0QnVmZmVyc1RvU2VuZCx0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlLHMpLHRoaXMuaGFuZGxlT3V0cHV0QnVmZmVyc1RvUmV0cmlldmUoKSx0aGlzLndyaXRlT3V0cHV0cyhlKSx0aGlzLnNoaWZ0T3V0cHV0QnVmZmVycygpLCEwKX1wcm9jZXNzT0xBKHQsZSxzKXtjb25zb2xlLmFzc2VydCghMSwiTm90IG92ZXJyaWRlbiIpfX1jbGFzcyBndHtjb25zdHJ1Y3Rvcih0KXtpZih0aGlzLnNpemU9dHwwLHRoaXMuc2l6ZTw9MXx8dGhpcy5zaXplJnRoaXMuc2l6ZS0xKXRocm93IG5ldyBFcnJvcigiRkZUIHNpemUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3byBhbmQgYmlnZ2VyIHRoYW4gMSIpO3RoaXMuX2NzaXplPXQ8PDE7Zm9yKHZhciBlPW5ldyBBcnJheSh0aGlzLnNpemUqMikscz0wO3M8ZS5sZW5ndGg7cys9Mil7Y29uc3QgYT1NYXRoLlBJKnMvdGhpcy5zaXplO2Vbc109TWF0aC5jb3MoYSksZVtzKzFdPS1NYXRoLnNpbihhKX10aGlzLnRhYmxlPWU7Zm9yKHZhciByPTAsbj0xO3RoaXMuc2l6ZT5uO248PD0xKXIrKzt0aGlzLl93aWR0aD1yJTI9PT0wP3ItMTpyLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgaT0wO2k8dGhpcy5fYml0cmV2Lmxlbmd0aDtpKyspe3RoaXMuX2JpdHJldltpXT0wO2Zvcih2YXIgaD0wO2g8dGhpcy5fd2lkdGg7aCs9Mil7dmFyIGM9dGhpcy5fd2lkdGgtaC0yO3RoaXMuX2JpdHJldltpXXw9KGk+Pj5oJjMpPDxjfX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9ZnJvbUNvbXBsZXhBcnJheSh0LGUpe2Zvcih2YXIgcz1lfHxuZXcgQXJyYXkodC5sZW5ndGg+Pj4xKSxyPTA7cjx0Lmxlbmd0aDtyKz0yKXNbcj4+PjFdPXRbcl07cmV0dXJuIHN9Y3JlYXRlQ29tcGxleEFycmF5KCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH10b0NvbXBsZXhBcnJheSh0LGUpe2Zvcih2YXIgcz1lfHx0aGlzLmNyZWF0ZUNvbXBsZXhBcnJheSgpLHI9MDtyPHMubGVuZ3RoO3IrPTIpc1tyXT10W3I+Pj4xXSxzW3IrMV09MDtyZXR1cm4gc31jb21wbGV0ZVNwZWN0cnVtKHQpe2Zvcih2YXIgZT10aGlzLl9jc2l6ZSxzPWU+Pj4xLHI9MjtyPHM7cis9Mil0W2Utcl09dFtyXSx0W2UtcisxXT0tdFtyKzFdfXRyYW5zZm9ybSh0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9cmVhbFRyYW5zZm9ybSh0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3JlYWxUcmFuc2Zvcm00KCksdGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfWludmVyc2VUcmFuc2Zvcm0odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MSx0aGlzLl90cmFuc2Zvcm00KCk7Zm9yKHZhciBzPTA7czx0Lmxlbmd0aDtzKyspdFtzXS89dGhpcy5zaXplO3RoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH1fdHJhbnNmb3JtNCgpe3ZhciB0PXRoaXMuX291dCxlPXRoaXMuX2NzaXplLHM9dGhpcy5fd2lkdGgscj0xPDxzLG49ZS9yPDwxLGksaCxjPXRoaXMuX2JpdHJldjtpZihuPT09NClmb3IoaT0wLGg9MDtpPGU7aSs9bixoKyspe2NvbnN0IG09Y1toXTt0aGlzLl9zaW5nbGVUcmFuc2Zvcm0yKGksbSxyKX1lbHNlIGZvcihpPTAsaD0wO2k8ZTtpKz1uLGgrKyl7Y29uc3QgbT1jW2hdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTQoaSxtLHIpfXZhciBhPXRoaXMuX2ludj8tMToxLHU9dGhpcy50YWJsZTtmb3Iocj4+PTI7cj49MjtyPj49Mil7bj1lL3I8PDE7dmFyIGY9bj4+PjI7Zm9yKGk9MDtpPGU7aSs9bilmb3IodmFyIHA9aStmLGw9aSxkPTA7bDxwO2wrPTIsZCs9cil7Y29uc3QgbT1sLGc9bStmLHY9ZytmLEk9ditmLF89dFttXSx3PXRbbSsxXSxiPXRbZ10sQj10W2crMV0sVD10W3ZdLFA9dFt2KzFdLHk9dFtJXSxBPXRbSSsxXSx4PV8sRj13LFY9dVtkXSxNPWEqdVtkKzFdLE89YipWLUIqTSxOPWIqTStCKlYsWT11WzIqZF0sTD1hKnVbMipkKzFdLEg9VCpZLVAqTCxVPVQqTCtQKlksSz11WzMqZF0sWj1hKnVbMypkKzFdLCQ9eSpLLUEqWixHPXkqWitBKkssaj14K0gsQz1GK1Usaz14LUgsSj1GLVUsUT1PKyQsej1OK0csRT1hKihPLSQpLFg9YSooTi1HKSxldD1qK1EsaXQ9Qyt6LG90PWotUSxhdD1DLXosaHQ9aytYLHV0PUotRSxjdD1rLVgsbHQ9SitFO3RbbV09ZXQsdFttKzFdPWl0LHRbZ109aHQsdFtnKzFdPXV0LHRbdl09b3QsdFt2KzFdPWF0LHRbSV09Y3QsdFtJKzFdPWx0fX19X3NpbmdsZVRyYW5zZm9ybTIodCxlLHMpe2NvbnN0IHI9dGhpcy5fb3V0LG49dGhpcy5fZGF0YSxpPW5bZV0saD1uW2UrMV0sYz1uW2Urc10sYT1uW2UrcysxXSx1PWkrYyxmPWgrYSxwPWktYyxsPWgtYTtyW3RdPXUsclt0KzFdPWYsclt0KzJdPXAsclt0KzNdPWx9X3NpbmdsZVRyYW5zZm9ybTQodCxlLHMpe2NvbnN0IHI9dGhpcy5fb3V0LG49dGhpcy5fZGF0YSxpPXRoaXMuX2ludj8tMToxLGg9cyoyLGM9cyozLGE9bltlXSx1PW5bZSsxXSxmPW5bZStzXSxwPW5bZStzKzFdLGw9bltlK2hdLGQ9bltlK2grMV0sbT1uW2UrY10sZz1uW2UrYysxXSx2PWErbCxJPXUrZCxfPWEtbCx3PXUtZCxiPWYrbSxCPXArZyxUPWkqKGYtbSksUD1pKihwLWcpLHk9ditiLEE9SStCLHg9XytQLEY9dy1ULFY9di1iLE09SS1CLE89Xy1QLE49dytUO3JbdF09eSxyW3QrMV09QSxyW3QrMl09eCxyW3QrM109RixyW3QrNF09VixyW3QrNV09TSxyW3QrNl09TyxyW3QrN109Tn1fcmVhbFRyYW5zZm9ybTQoKXt2YXIgdD10aGlzLl9vdXQsZT10aGlzLl9jc2l6ZSxzPXRoaXMuX3dpZHRoLHI9MTw8cyxuPWUvcjw8MSxpLGgsYz10aGlzLl9iaXRyZXY7aWYobj09PTQpZm9yKGk9MCxoPTA7aTxlO2krPW4saCsrKXtjb25zdCBmdD1jW2hdO3RoaXMuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yKGksZnQ+Pj4xLHI+Pj4xKX1lbHNlIGZvcihpPTAsaD0wO2k8ZTtpKz1uLGgrKyl7Y29uc3QgZnQ9Y1toXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNChpLGZ0Pj4+MSxyPj4+MSl9dmFyIGE9dGhpcy5faW52Py0xOjEsdT10aGlzLnRhYmxlO2ZvcihyPj49MjtyPj0yO3I+Pj0yKXtuPWUvcjw8MTt2YXIgZj1uPj4+MSxwPWY+Pj4xLGw9cD4+PjE7Zm9yKGk9MDtpPGU7aSs9bilmb3IodmFyIGQ9MCxtPTA7ZDw9bDtkKz0yLG0rPXIpe3ZhciBnPWkrZCx2PWcrcCxJPXYrcCxfPUkrcCx3PXRbZ10sYj10W2crMV0sQj10W3ZdLFQ9dFt2KzFdLFA9dFtJXSx5PXRbSSsxXSxBPXRbX10seD10W18rMV0sRj13LFY9YixNPXVbbV0sTz1hKnVbbSsxXSxOPUIqTS1UKk8sWT1CKk8rVCpNLEw9dVsyKm1dLEg9YSp1WzIqbSsxXSxVPVAqTC15KkgsSz1QKkgreSpMLFo9dVszKm1dLCQ9YSp1WzMqbSsxXSxHPUEqWi14KiQsaj1BKiQreCpaLEM9RitVLGs9VitLLEo9Ri1VLFE9Vi1LLHo9TitHLEU9WStqLFg9YSooTi1HKSxldD1hKihZLWopLGl0PUMreixvdD1rK0UsYXQ9SitldCxodD1RLVg7aWYodFtnXT1pdCx0W2crMV09b3QsdFt2XT1hdCx0W3YrMV09aHQsZD09PTApe3ZhciB1dD1DLXosY3Q9ay1FO3RbSV09dXQsdFtJKzFdPWN0O2NvbnRpbnVlfWlmKGQhPT1sKXt2YXIgbHQ9Six6dD0tUSxFdD1DLFJ0PS1rLER0PS1hKmV0LHF0PS1hKlgsV3Q9LWEqRSxZdD0tYSp6LEx0PWx0K0R0LEh0PXp0K3F0LFV0PUV0K1l0LEt0PVJ0LVd0LGR0PWkrcC1kLG10PWkrZi1kO3RbZHRdPUx0LHRbZHQrMV09SHQsdFttdF09VXQsdFttdCsxXT1LdH19fX1fc2luZ2xlUmVhbFRyYW5zZm9ybTIodCxlLHMpe2NvbnN0IHI9dGhpcy5fb3V0LG49dGhpcy5fZGF0YSxpPW5bZV0saD1uW2Urc10sYz1pK2gsYT1pLWg7clt0XT1jLHJbdCsxXT0wLHJbdCsyXT1hLHJbdCszXT0wfV9zaW5nbGVSZWFsVHJhbnNmb3JtNCh0LGUscyl7Y29uc3Qgcj10aGlzLl9vdXQsbj10aGlzLl9kYXRhLGk9dGhpcy5faW52Py0xOjEsaD1zKjIsYz1zKjMsYT1uW2VdLHU9bltlK3NdLGY9bltlK2hdLHA9bltlK2NdLGw9YStmLGQ9YS1mLG09dStwLGc9aSoodS1wKSx2PWwrbSxJPWQsXz0tZyx3PWwtbSxiPWQsQj1nO3JbdF09dixyW3QrMV09MCxyW3QrMl09SSxyW3QrM109XyxyW3QrNF09dyxyW3QrNV09MCxyW3QrNl09YixyW3QrN109Qn19Y29uc3QgUj0obyx0LGUpPT5NYXRoLm1pbihNYXRoLm1heChvLHQpLGUpLEl0PShvLHQpPT4obyV0K3QpJXQsRD0xMjg7ZnVuY3Rpb24gYnQobyx0KXtyZXR1cm4gbzx0PyhvLz10LG8rby1vKm8tMSk6bz4xLXQ/KG89KG8tMSkvdCxvKm8rbytvKzEpOjB9Y29uc3Qgc3Q9e3RyaShvLHQ9LjUpe2NvbnN0IGU9MS10O3JldHVybiBvPj10PzEvZS1vL2U6by90fSxzaW5lKG8pe3JldHVybiBNYXRoLnNpbihNYXRoLlBJKjIqbykqLjUrLjV9LHJhbXAobyl7cmV0dXJuIG99LHNhdyhvKXtyZXR1cm4gMS1vfSxzcXVhcmUobyx0PS41KXtyZXR1cm4gbz49dD8wOjF9LGN1c3RvbShvLHQ9WzAsMV0pe2NvbnN0IGU9dC5sZW5ndGgtMSxzPU1hdGguZmxvb3IobyplKSxyPTEvZSxuPVIodFtzXSwwLDEpLGg9Uih0W3MrMV0sMCwxKSxjPW4sYT0wLHU9cjtyZXR1cm4oaC1jKS8odS1hKSooby1yKnMpK259LHNhd2JsZXAobyx0KXtyZXR1cm4gMipvLTEtYnQobyx0KX19O2Z1bmN0aW9uIHEobyx0KXtyZXR1cm4gdC5sZW5ndGg+MT90W29dOnRbMF19Y29uc3QgQnQ9T2JqZWN0LmtleXMoc3QpO2NsYXNzIF90IGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6InRpbWUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6MH0se25hbWU6ImZyZXF1ZW5jeSIsZGVmYXVsdFZhbHVlOi41fSx7bmFtZToic2tldyIsZGVmYXVsdFZhbHVlOi41fSx7bmFtZToiZGVwdGgiLGRlZmF1bHRWYWx1ZToxfSx7bmFtZToicGhhc2VvZmZzZXQiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToic2hhcGUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiZGNvZmZzZXQiLGRlZmF1bHRWYWx1ZTowfV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMucGhhc2V9aW5jcmVtZW50UGhhc2UodCl7dGhpcy5waGFzZSs9dCx0aGlzLnBoYXNlPjEmJih0aGlzLnBoYXNlPXRoaXMucGhhc2UtMSl9cHJvY2Vzcyh0LGUscyl7aWYoY3VycmVudFRpbWU+PXMuZW5kWzBdKXJldHVybiExO2NvbnN0IHI9ZVswXSxuPXMuZnJlcXVlbmN5WzBdLGk9cy50aW1lWzBdLGg9cy5kZXB0aFswXSxjPXMuc2tld1swXSxhPXMucGhhc2VvZmZzZXRbMF0sdT1zLmRjb2Zmc2V0WzBdLGY9QnRbcy5zaGFwZVswXV0scD1yWzBdLmxlbmd0aD8/MDt0aGlzLnBoYXNlPT1udWxsJiYodGhpcy5waGFzZT1JdChpKm4rYSwxKSk7Y29uc3QgbD1uL3NhbXBsZVJhdGU7Zm9yKGxldCBkPTA7ZDxwO2QrKyl7Zm9yKGxldCBtPTA7bTxyLmxlbmd0aDttKyspe2NvbnN0IGc9KHN0W2ZdKHRoaXMucGhhc2UsYykrdSkqaDtyW21dW2RdPWd9dGhpcy5pbmNyZW1lbnRQaGFzZShsKX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImxmby1wcm9jZXNzb3IiLF90KTtjbGFzcyB3dCBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJjb2Fyc2UiLGRlZmF1bHRWYWx1ZToxfV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuc3RhcnRlZD0hMX1wcm9jZXNzKHQsZSxzKXtjb25zdCByPXRbMF0sbj1lWzBdLGk9clswXSE9PXZvaWQgMDtpZih0aGlzLnN0YXJ0ZWQmJiFpKXJldHVybiExO3RoaXMuc3RhcnRlZD1pO2xldCBoPXMuY29hcnNlWzBdPz8wO2g9TWF0aC5tYXgoMSxoKTtmb3IobGV0IGM9MDtjPEQ7YysrKWZvcihsZXQgYT0wO2E8ci5sZW5ndGg7YSsrKW5bYV1bY109YyVoPT09MD9yW2FdW2NdOm5bYV1bYy0xXTtyZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImNvYXJzZS1wcm9jZXNzb3IiLHd0KTtjbGFzcyBTdCBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3NvcntzdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJjcnVzaCIsZGVmYXVsdFZhbHVlOjB9XX1jb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5zdGFydGVkPSExfXByb2Nlc3ModCxlLHMpe2NvbnN0IHI9dFswXSxuPWVbMF0saT1yWzBdIT09dm9pZCAwO2lmKHRoaXMuc3RhcnRlZCYmIWkpcmV0dXJuITE7dGhpcy5zdGFydGVkPWk7bGV0IGg9cy5jcnVzaFswXT8/ODtoPU1hdGgubWF4KDEsaCk7Zm9yKGxldCBjPTA7YzxEO2MrKylmb3IobGV0IGE9MDthPHIubGVuZ3RoO2ErKyl7Y29uc3QgdT1NYXRoLnBvdygyLGgtMSk7blthXVtjXT1NYXRoLnJvdW5kKHJbYV1bY10qdSkvdX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImNydXNoLXByb2Nlc3NvciIsU3QpO2NsYXNzIFR0IGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6InNoYXBlIixkZWZhdWx0VmFsdWU6MH0se25hbWU6InBvc3RnYWluIixkZWZhdWx0VmFsdWU6MX1dfWNvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnN0YXJ0ZWQ9ITF9cHJvY2Vzcyh0LGUscyl7Y29uc3Qgcj10WzBdLG49ZVswXSxpPXJbMF0hPT12b2lkIDA7aWYodGhpcy5zdGFydGVkJiYhaSlyZXR1cm4hMTt0aGlzLnN0YXJ0ZWQ9aTtsZXQgaD1zLnNoYXBlWzBdO2g9aDwxP2g6MS00ZS0xMCxoPTIqaC8oMS1oKTtjb25zdCBjPU1hdGgubWF4KC4wMDEsTWF0aC5taW4oMSxzLnBvc3RnYWluWzBdKSk7Zm9yKGxldCBhPTA7YTxEO2ErKylmb3IobGV0IHU9MDt1PHIubGVuZ3RoO3UrKyluW3VdW2FdPSgxK2gpKnJbdV1bYV0vKDEraCpNYXRoLmFicyhyW3VdW2FdKSkqYztyZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoInNoYXBlLXByb2Nlc3NvciIsVHQpO2Z1bmN0aW9uIFMobyl7Y29uc3QgdD1vKm87cmV0dXJuIG8qKDI3K3QpLygyNys5KnQpfWNvbnN0IHB0PTMuMTQxNTkyNjUzNTk7Y2xhc3MgUHQgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NTAwfSx7bmFtZToicSIsZGVmYXVsdFZhbHVlOjF9LHtuYW1lOiJkcml2ZSIsZGVmYXVsdFZhbHVlOi42OX1dfWNvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnN0YXJ0ZWQ9ITEsdGhpcy5wMD1bMCwwXSx0aGlzLnAxPVswLDBdLHRoaXMucDI9WzAsMF0sdGhpcy5wMz1bMCwwXSx0aGlzLnAzMj1bMCwwXSx0aGlzLnAzMz1bMCwwXSx0aGlzLnAzND1bMCwwXX1wcm9jZXNzKHQsZSxzKXtjb25zdCByPXRbMF0sbj1lWzBdLGk9clswXSE9PXZvaWQgMDtpZih0aGlzLnN0YXJ0ZWQmJiFpKXJldHVybiExO3RoaXMuc3RhcnRlZD1pO2NvbnN0IGg9cy5xWzBdLGM9UihNYXRoLmV4cChzLmRyaXZlWzBdKSwuMSwyZTMpO2xldCBhPXMuZnJlcXVlbmN5WzBdO2E9YSoyKnB0L3NhbXBsZVJhdGUsYT1hPjE/MTphO2NvbnN0IHU9TWF0aC5taW4oOCxoKi4xMyk7bGV0IGY9MS9jKk1hdGgubWluKDEuNzUsMSt1KTtmb3IobGV0IHA9MDtwPEQ7cCsrKWZvcihsZXQgbD0wO2w8ci5sZW5ndGg7bCsrKXtjb25zdCBkPXRoaXMucDNbbF0qLjM2MDg5MSt0aGlzLnAzMltsXSouNDE3MjkrdGhpcy5wMzNbbF0qLjE3Nzg5Nit0aGlzLnAzNFtsXSouMDQzOTcyNTt0aGlzLnAzNFtsXT10aGlzLnAzM1tsXSx0aGlzLnAzM1tsXT10aGlzLnAzMltsXSx0aGlzLnAzMltsXT10aGlzLnAzW2xdLHRoaXMucDBbbF0rPShTKHJbbF1bcF0qYy11KmQpLVModGhpcy5wMFtsXSkpKmEsdGhpcy5wMVtsXSs9KFModGhpcy5wMFtsXSktUyh0aGlzLnAxW2xdKSkqYSx0aGlzLnAyW2xdKz0oUyh0aGlzLnAxW2xdKS1TKHRoaXMucDJbbF0pKSphLHRoaXMucDNbbF0rPShTKHRoaXMucDJbbF0pLVModGhpcy5wM1tsXSkpKmEsbltsXVtwXT1kKmZ9cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJsYWRkZXItcHJvY2Vzc29yIixQdCk7Y2xhc3MgeXQgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiZGlzdG9ydCIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJwb3N0Z2FpbiIsZGVmYXVsdFZhbHVlOjF9XX1jb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5zdGFydGVkPSExfXByb2Nlc3ModCxlLHMpe2NvbnN0IHI9dFswXSxuPWVbMF0saT1yWzBdIT09dm9pZCAwO2lmKHRoaXMuc3RhcnRlZCYmIWkpcmV0dXJuITE7dGhpcy5zdGFydGVkPWk7Y29uc3QgaD1NYXRoLmV4cG0xKHMuZGlzdG9ydFswXSksYz1NYXRoLm1heCguMDAxLE1hdGgubWluKDEscy5wb3N0Z2FpblswXSkpO2ZvcihsZXQgYT0wO2E8RDthKyspZm9yKGxldCB1PTA7dTxyLmxlbmd0aDt1Kyspblt1XVthXT0oMStoKSpyW3VdW2FdLygxK2gqTWF0aC5hYnMoclt1XVthXSkpKmM7cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJkaXN0b3J0LXByb2Nlc3NvciIseXQpO2Z1bmN0aW9uIEF0KG8sdCxlKXtyZXR1cm4gZSoodC1vKStvfWZ1bmN0aW9uIHh0KG8sdCxlKXtyZXR1cm4gbzwyPzA6QXQoLXQqLjUsdCouNSxlLyhvLTEpKX1mdW5jdGlvbiBydChvLHQpe3JldHVybiBvKk1hdGgucG93KDIsdC8xMil9Y2xhc3MgRnQgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMucGhhc2U9W119c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiYmVnaW4iLGRlZmF1bHRWYWx1ZTowLG1heDpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksbWluOjB9LHtuYW1lOiJlbmQiLGRlZmF1bHRWYWx1ZTowLG1heDpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksbWluOjB9LHtuYW1lOiJmcmVxdWVuY3kiLGRlZmF1bHRWYWx1ZTo0NDAsbWluOk51bWJlci5FUFNJTE9OfSx7bmFtZToicGFuc3ByZWFkIixkZWZhdWx0VmFsdWU6LjQsbWluOjAsbWF4OjF9LHtuYW1lOiJmcmVxc3ByZWFkIixkZWZhdWx0VmFsdWU6LjIsbWluOjB9LHtuYW1lOiJkZXR1bmUiLGRlZmF1bHRWYWx1ZTowLG1pbjowfSx7bmFtZToidm9pY2VzIixkZWZhdWx0VmFsdWU6NSxtaW46MX1dfXByb2Nlc3ModCxlLHMpe2lmKGN1cnJlbnRUaW1lPD1zLmJlZ2luWzBdKXJldHVybiEwO2lmKGN1cnJlbnRUaW1lPj1zLmVuZFswXSlyZXR1cm4hMTtsZXQgcj1zLmZyZXF1ZW5jeVswXTtyPXIqTWF0aC5wb3coMixzLmRldHVuZVswXS8xMjAwKTtjb25zdCBuPWVbMF0saT1zLnZvaWNlc1swXSxoPXMuZnJlcXNwcmVhZFswXSxjPXMucGFuc3ByZWFkWzBdKi41Ky41LGE9TWF0aC5zcXJ0KDEtYyksdT1NYXRoLnNxcnQoYyk7Zm9yKGxldCBmPTA7ZjxpO2YrKyl7Y29uc3QgcD0oZiYxKT09MSxsPXJ0KHIseHQoaSxoLGYpKTtsZXQgZD1hLG09dTtwJiYoZD11LG09YSk7Y29uc3QgZz1sL3NhbXBsZVJhdGU7Zm9yKGxldCB2PTA7djxuWzBdLmxlbmd0aDt2Kyspe3RoaXMucGhhc2VbZl09dGhpcy5waGFzZVtmXT8/TWF0aC5yYW5kb20oKTtjb25zdCBJPXN0LnNhd2JsZXAodGhpcy5waGFzZVtmXSxnKTtuWzBdW3ZdPW5bMF1bdl0rSSpkLG5bMV1bdl09blsxXVt2XStJKm0sdGhpcy5waGFzZVtmXSs9Zyx0aGlzLnBoYXNlW2ZdPjEmJih0aGlzLnBoYXNlW2ZdPXRoaXMucGhhc2VbZl0tMSl9fXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3Nvcigic3VwZXJzYXctb3NjaWxsYXRvciIsRnQpO2NvbnN0IFZ0PTIwNDg7ZnVuY3Rpb24gTXQobyl7bGV0IHQ9bmV3IEZsb2F0MzJBcnJheShvKTtmb3IodmFyIGU9MDtlPG87ZSsrKXRbZV09LjUqKDEtTWF0aC5jb3MoMipNYXRoLlBJKmUvbykpO3JldHVybiB0fWNsYXNzIE90IGV4dGVuZHMgdnR7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToicGl0Y2hGYWN0b3IiLGRlZmF1bHRWYWx1ZToxfV19Y29uc3RydWN0b3IodCl7dC5wcm9jZXNzb3JPcHRpb25zPXtibG9ja1NpemU6VnR9LHN1cGVyKHQpLHRoaXMuZmZ0U2l6ZT10aGlzLmJsb2NrU2l6ZSx0aGlzLnRpbWVDdXJzb3I9MCx0aGlzLmhhbm5XaW5kb3c9TXQodGhpcy5ibG9ja1NpemUpLHRoaXMuZmZ0PW5ldyBndCh0aGlzLmZmdFNpemUpLHRoaXMuZnJlcUNvbXBsZXhCdWZmZXI9dGhpcy5mZnQuY3JlYXRlQ29tcGxleEFycmF5KCksdGhpcy5mcmVxQ29tcGxleEJ1ZmZlclNoaWZ0ZWQ9dGhpcy5mZnQuY3JlYXRlQ29tcGxleEFycmF5KCksdGhpcy50aW1lQ29tcGxleEJ1ZmZlcj10aGlzLmZmdC5jcmVhdGVDb21wbGV4QXJyYXkoKSx0aGlzLm1hZ25pdHVkZXM9bmV3IEZsb2F0MzJBcnJheSh0aGlzLmZmdFNpemUvMisxKSx0aGlzLnBlYWtJbmRleGVzPW5ldyBJbnQzMkFycmF5KHRoaXMubWFnbml0dWRlcy5sZW5ndGgpLHRoaXMubmJQZWFrcz0wfXByb2Nlc3NPTEEodCxlLHMpe2xldCByPXMucGl0Y2hGYWN0b3Jbcy5waXRjaEZhY3Rvci5sZW5ndGgtMV07cjwwJiYocj1yKi4yNSkscj1NYXRoLm1heCgwLHIrMSk7Zm9yKHZhciBuPTA7bjx0aGlzLm5iSW5wdXRzO24rKylmb3IodmFyIGk9MDtpPHRbbl0ubGVuZ3RoO2krKyl7dmFyIGg9dFtuXVtpXSxjPWVbbl1baV07dGhpcy5hcHBseUhhbm5XaW5kb3coaCksdGhpcy5mZnQucmVhbFRyYW5zZm9ybSh0aGlzLmZyZXFDb21wbGV4QnVmZmVyLGgpLHRoaXMuY29tcHV0ZU1hZ25pdHVkZXMoKSx0aGlzLmZpbmRQZWFrcygpLHRoaXMuc2hpZnRQZWFrcyhyKSx0aGlzLmZmdC5jb21wbGV0ZVNwZWN0cnVtKHRoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkKSx0aGlzLmZmdC5pbnZlcnNlVHJhbnNmb3JtKHRoaXMudGltZUNvbXBsZXhCdWZmZXIsdGhpcy5mcmVxQ29tcGxleEJ1ZmZlclNoaWZ0ZWQpLHRoaXMuZmZ0LmZyb21Db21wbGV4QXJyYXkodGhpcy50aW1lQ29tcGxleEJ1ZmZlcixjKSx0aGlzLmFwcGx5SGFubldpbmRvdyhjKX10aGlzLnRpbWVDdXJzb3IrPXRoaXMuaG9wU2l6ZX1hcHBseUhhbm5XaW5kb3codCl7Zm9yKHZhciBlPTA7ZTx0aGlzLmJsb2NrU2l6ZTtlKyspdFtlXT10W2VdKnRoaXMuaGFubldpbmRvd1tlXSoxLjYyfWNvbXB1dGVNYWduaXR1ZGVzKCl7Zm9yKHZhciB0PTAsZT0wO3Q8dGhpcy5tYWduaXR1ZGVzLmxlbmd0aDspe2xldCBzPXRoaXMuZnJlcUNvbXBsZXhCdWZmZXJbZV0scj10aGlzLmZyZXFDb21wbGV4QnVmZmVyW2UrMV07dGhpcy5tYWduaXR1ZGVzW3RdPXMqKjIrcioqMix0Kz0xLGUrPTJ9fWZpbmRQZWFrcygpe3RoaXMubmJQZWFrcz0wO3ZhciB0PTI7bGV0IGU9dGhpcy5tYWduaXR1ZGVzLmxlbmd0aC0yO2Zvcig7dDxlOyl7bGV0IHM9dGhpcy5tYWduaXR1ZGVzW3RdO2lmKHRoaXMubWFnbml0dWRlc1t0LTFdPj1zfHx0aGlzLm1hZ25pdHVkZXNbdC0yXT49cyl7dCsrO2NvbnRpbnVlfWlmKHRoaXMubWFnbml0dWRlc1t0KzFdPj1zfHx0aGlzLm1hZ25pdHVkZXNbdCsyXT49cyl7dCsrO2NvbnRpbnVlfXRoaXMucGVha0luZGV4ZXNbdGhpcy5uYlBlYWtzXT10LHRoaXMubmJQZWFrcysrLHQrPTJ9fXNoaWZ0UGVha3ModCl7dGhpcy5mcmVxQ29tcGxleEJ1ZmZlclNoaWZ0ZWQuZmlsbCgwKTtmb3IodmFyIGU9MDtlPHRoaXMubmJQZWFrcztlKyspe2xldCBpPXRoaXMucGVha0luZGV4ZXNbZV0saD1NYXRoLnJvdW5kKGkqdCk7aWYoaD50aGlzLm1hZ25pdHVkZXMubGVuZ3RoKWJyZWFrO3ZhciBzPTAscj10aGlzLmZmdFNpemU7aWYoZT4wKXtsZXQgdT10aGlzLnBlYWtJbmRleGVzW2UtMV07cz1pLU1hdGguZmxvb3IoKGktdSkvMil9aWYoZTx0aGlzLm5iUGVha3MtMSl7bGV0IHU9dGhpcy5wZWFrSW5kZXhlc1tlKzFdO3I9aStNYXRoLmNlaWwoKHUtaSkvMil9bGV0IGM9cy1pLGE9ci1pO2Zvcih2YXIgbj1jO248YTtuKyspe2xldCB1PWkrbixmPWgrbjtpZihmPj10aGlzLm1hZ25pdHVkZXMubGVuZ3RoKWJyZWFrO2xldCBwPTIqTWF0aC5QSSooZi11KS90aGlzLmZmdFNpemUsbD1NYXRoLmNvcyhwKnRoaXMudGltZUN1cnNvciksZD1NYXRoLnNpbihwKnRoaXMudGltZUN1cnNvciksbT11KjIsZz1tKzEsdj10aGlzLmZyZXFDb21wbGV4QnVmZmVyW21dLEk9dGhpcy5mcmVxQ29tcGxleEJ1ZmZlcltnXSxfPXYqbC1JKmQsdz12KmQrSSpsLGI9ZioyLEI9YisxO3RoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkW2JdKz1fLHRoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkW0JdKz13fX19fXJlZ2lzdGVyUHJvY2Vzc29yKCJwaGFzZS12b2NvZGVyLXByb2Nlc3NvciIsT3QpO2NsYXNzIE50IGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnBpPXB0LHRoaXMucGhpPS10aGlzLnBpLHRoaXMuWTA9MCx0aGlzLlkxPTAsdGhpcy5QVz10aGlzLnBpLHRoaXMuQj0yLjMsdGhpcy5kcGhpZj0wLHRoaXMuZW52Zj0wfXN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImJlZ2luIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfSx7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NDQwLG1pbjpOdW1iZXIuRVBTSUxPTn0se25hbWU6ImRldHVuZSIsZGVmYXVsdFZhbHVlOjAsbWluOk51bWJlci5ORUdBVElWRV9JTkZJTklUWSxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSx7bmFtZToicHVsc2V3aWR0aCIsZGVmYXVsdFZhbHVlOjEsbWluOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWX1dfXByb2Nlc3ModCxlLHMpe2lmKHRoaXMuZGlzY29ubmVjdGVkKXJldHVybiExO2lmKGN1cnJlbnRUaW1lPD1zLmJlZ2luWzBdKXJldHVybiEwO2lmKGN1cnJlbnRUaW1lPj1zLmVuZFswXSlyZXR1cm4hMTtjb25zdCByPWVbMF07bGV0IG49MSxpO2ZvcihsZXQgaD0wO2g8KHJbMF0ubGVuZ3RoPz8wKTtoKyspe2NvbnN0IGM9KDEtUihxKGgscy5wdWxzZXdpZHRoKSwtLjk5LC45OSkpKnRoaXMucGksYT1xKGgscy5kZXR1bmUpLHU9cnQocShoLHMuZnJlcXVlbmN5KSxhLzEwMCk7aT11Kih0aGlzLnBpLyhzYW1wbGVSYXRlKi41KSksdGhpcy5kcGhpZis9LjEqKGktdGhpcy5kcGhpZiksbio9Ljk5OTgsdGhpcy5lbnZmKz0uMSoobi10aGlzLmVudmYpLHRoaXMuQj0yLjMqKDEtMWUtNCp1KSx0aGlzLkI8MCYmKHRoaXMuQj0wKSx0aGlzLnBoaSs9dGhpcy5kcGhpZix0aGlzLnBoaT49dGhpcy5waSYmKHRoaXMucGhpLT0yKnRoaXMucGkpO2xldCBmPU1hdGguY29zKHRoaXMucGhpK3RoaXMuQip0aGlzLlkwKTt0aGlzLlkwPS41KihmK3RoaXMuWTApO2xldCBwPU1hdGguY29zKHRoaXMucGhpK3RoaXMuQip0aGlzLlkxK2MpO3RoaXMuWTE9LjUqKHArdGhpcy5ZMSk7Zm9yKGxldCBsPTA7bDxyLmxlbmd0aDtsKyspcltsXVtoXT0uMTUqKGYtcCkqdGhpcy5lbnZmfXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigicHVsc2Utb3NjaWxsYXRvciIsTnQpO2NvbnN0IG50PXtiaXRDOmZ1bmN0aW9uKG8sdCxlKXtyZXR1cm4gbyZ0P2U6MH0sYnI6ZnVuY3Rpb24obyx0PTgpe2lmKHQ+MzIpdGhyb3cgbmV3IEVycm9yKCJicigpIFNpemUgY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiAzMiIpO3tsZXQgZT0wO2ZvcihsZXQgcz0wO3M8dC0wO3MrKyllKz1udC5iaXRDKG8sMioqcywyKioodC0ocysxKSkpO3JldHVybiBlfX0sc2luZjpmdW5jdGlvbihvKXtyZXR1cm4gTWF0aC5zaW4oby8oMTI4L01hdGguUEkpKX0sY29zZjpmdW5jdGlvbihvKXtyZXR1cm4gTWF0aC5jb3Moby8oMTI4L01hdGguUEkpKX0sdGFuZjpmdW5jdGlvbihvKXtyZXR1cm4gTWF0aC50YW4oby8oMTI4L01hdGguUEkpKX0scmVnRzpmdW5jdGlvbihvLHQpe3JldHVybiB0LnRlc3Qoby50b1N0cmluZygyKSl9fTtsZXQgVyx0dDtmdW5jdGlvbiBDdChvKXtpZigoV3x8dHQpPT1udWxsKXtXPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE1hdGgpLHR0PVcubWFwKHM9Pk1hdGhbc10pO2NvbnN0IHQ9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobnQpLGU9dC5tYXAocz0+bnRbc10pO1cucHVzaCgiaW50Iiwid2luZG93IiwuLi50KSx0dC5wdXNoKE1hdGguZmxvb3IsZ2xvYmFsVGhpcywuLi5lKX1yZXR1cm4gbmV3IEZ1bmN0aW9uKC4uLlcsInQiLGByZXR1cm4gMCwKJHtvfHwwfTtgKS5iaW5kKGdsb2JhbFRoaXMsLi4udHQpfWNsYXNzIGt0IGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnBvcnQub25tZXNzYWdlPXQ9PntsZXR7Y29kZVRleHQ6ZX09dC5kYXRhO2NvbnN0e2J5dGVCZWF0U3RhcnRUaW1lOnN9PXQuZGF0YTtzIT1udWxsJiYodGhpcy50PTAsdGhpcy5pbml0aWFsT2Zmc2V0PU1hdGguZmxvb3IocykpLGU9ZS50cmltKCkucmVwbGFjZSgvXmV2YWxcKHVuZXNjYXBlXChlc2NhcGUoPzpgfFwoJ3xcKCJ8XChgKSguKj8pKD86YHwnXCl8IlwpfGBcKSkucmVwbGFjZVwoXC91XChcLlwuXClcL2csWyInYF1cJDElWyInYF1cKVwpXCkkLywocixuKT0+dW5lc2NhcGUoZXNjYXBlKG4pLnJlcGxhY2UoL3UoLi4pL2csIiQxJSIpKSksdGhpcy5mdW5jPUN0KGUpfSx0aGlzLmluaXRpYWxPZmZzZXQ9bnVsbCx0aGlzLnQ9bnVsbCx0aGlzLmZ1bmM9bnVsbH1zdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJiZWdpbiIsZGVmYXVsdFZhbHVlOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWSxtaW46MH0se25hbWU6ImZyZXF1ZW5jeSIsZGVmYXVsdFZhbHVlOjQ0MCxtaW46TnVtYmVyLkVQU0lMT059LHtuYW1lOiJkZXR1bmUiLGRlZmF1bHRWYWx1ZTowLG1pbjpOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWX0se25hbWU6ImVuZCIsZGVmYXVsdFZhbHVlOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWSxtaW46MH1dfXByb2Nlc3ModCxlLHMpe2lmKHRoaXMuZGlzY29ubmVjdGVkKXJldHVybiExO2lmKGN1cnJlbnRUaW1lPD1zLmJlZ2luWzBdKXJldHVybiEwO2lmKGN1cnJlbnRUaW1lPj1zLmVuZFswXSlyZXR1cm4hMTt0aGlzLnQ9PW51bGwmJih0aGlzLnQ9cy5iZWdpblswXSpzYW1wbGVSYXRlKTtjb25zdCByPWVbMF07Zm9yKGxldCBuPTA7bjxyWzBdLmxlbmd0aDtuKyspe2NvbnN0IGk9cShuLHMuZGV0dW5lKSxoPXJ0KHEobixzLmZyZXF1ZW5jeSksaS8xMDApO2xldCBjPXRoaXMudC8oc2FtcGxlUmF0ZS8yNTYpKmgrdGhpcy5pbml0aWFsT2Zmc2V0O2NvbnN0IGY9KCh0aGlzLmZ1bmMoYykmMjU1KS8xMjcuNS0xKSouMjtmb3IobGV0IHA9MDtwPHIubGVuZ3RoO3ArKylyW3BdW25dPVIoZiwtLjQsLjQpO3RoaXMudD10aGlzLnQrMX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImJ5dGUtYmVhdC1wcm9jZXNzb3IiLGt0KX0pKCk7Cg==";
function Qt(e) {
  const t = Ee().createGain();
  return t.gain.value = e, t;
}
const ro = (e, t, n, r) => r - n === 0 ? 0 : (t - e) / (r - n);
function Wt(e, t, n, r) {
  const i = new AudioWorkletNode(e, t, r);
  return Object.entries(n).forEach(([s, u]) => {
    i.parameters.get(s).value = u;
  }), i;
}
const en = (e, t, n, r, i, s, u, a, o, f = "exponential") => {
  t = Mn(t), n = Mn(n), r = Mn(r), i = Mn(i);
  const h = f === "exponential" ? "exponentialRampToValueAtTime" : "linearRampToValueAtTime";
  f === "exponential" && (s = s === 0 ? 1e-3 : s, u = u === 0 ? 1e-3 : u);
  const m = u - s, p = u, A = s + r * m, M = o - a, v = (E) => {
    let k;
    if (t > E) {
      let _ = ro(s, p, 0, t);
      k = E * _ + (s > p ? s : 0);
    } else
      k = (E - t) * ro(p, A, 0, n) + p;
    return f === "exponential" && (k = k || 1e-3), k;
  };
  e.setValueAtTime(s, a), t > M ? e[h](v(M), o) : t + n > M ? (e[h](v(t), a + t), e[h](v(M), o)) : (e[h](v(t), a + t), e[h](v(t + n), a + t + n), e.setValueAtTime(A, o)), e[h](s, o + i);
};
function qp(e, t, n, r, i, s) {
  const u = {
    threshold: t ?? -3,
    ratio: n ?? 10,
    knee: r ?? 10,
    attack: i ?? 5e-3,
    release: s ?? 0.05
  };
  return new DynamicsCompressorNode(e, u);
}
const tn = (e, t = "linear", n) => {
  const [u, a, o, f] = e;
  if (u == null && a == null && o == null && f == null)
    return n ?? [1e-3, 1e-3, 1, 0.01];
  const h = o ?? (u != null && a == null || u == null && a == null ? 1 : 1e-3);
  return [Math.max(u ?? 0, 1e-3), Math.max(a ?? 0, 1e-3), Math.min(h, 1), Math.max(f ?? 0, 0.01)];
};
function Ci(e, t, n, r, i, s, u, a, o, f, h, m, p, A) {
  const M = "exponential", [v, E, k, _] = tn([i, s, u, a], M, [5e-3, 0.14, 0, 0.1]);
  let G, S;
  if (p === "ladder" ? (G = Wt(e, "ladder-processor", { frequency: n, q: r, drive: A }), S = G.parameters.get("frequency")) : (G = e.createBiquadFilter(), G.type = t, G.Q.value = r, G.frequency.value = n, S = G.frequency), (i ?? s ?? u ?? a ?? o) !== void 0) {
    o = Mn(o, 1, !0), m = Mn(m, 0, !0);
    const B = Math.abs(o), I = B * m;
    let V = Jr(2 ** -I * n, 0, 2e4), q = Jr(2 ** (B - I) * n, 0, 2e4);
    return o < 0 && ([V, q] = [q, V]), en(S, v, E, k, _, V, q, f, h, M), G;
  }
  return G;
}
let io = (e) => e < 0.5 ? 1 : 1 - (e - 0.5) / 0.5;
function Kp(e, t, n = 0) {
  const r = Ee();
  if (!n)
    return e;
  let i = r.createGain(), s = r.createGain();
  e.connect(i), t.connect(s), i.gain.value = io(n), s.gain.value = io(1 - n);
  let u = r.createGain();
  return i.connect(u), s.connect(u), u;
}
let oC = ["linear", "exponential"];
function Yr(e, t, n, r) {
  if (!(t.pattack ?? t.pdecay ?? t.psustain ?? t.prelease ?? t.penv))
    return;
  const s = Mn(t.penv, 1, !0), u = oC[t.pcurve ?? 0];
  let [a, o, f, h] = tn(
    [t.pattack, t.pdecay, t.psustain, t.prelease],
    u,
    [0.2, 1e-3, 1, 1e-3]
  ), m = t.panchor ?? f;
  const p = s * 100, A = 0 - p * m, M = p - p * m;
  en(e, a, o, f, h, A, M, n, r, u);
}
function Ur(e, t, n) {
  const { vibmod: r = 0.5, vib: i } = t;
  let s;
  if (i > 0) {
    s = Ee().createOscillator(), s.frequency.value = i;
    const u = Ee().createGain();
    return u.gain.value = r * 100, s.connect(u), u.connect(e), s.start(n), s;
  }
}
function vi(e, t, n, r) {
  const i = e.createConstantSource();
  return i.start(n), i.stop(r), i.onended = () => {
    t();
  }, i;
}
const cC = (e, t = 1, n = "sine") => {
  const r = Ee(), i = r.createOscillator();
  i.type = n, i.frequency.value = e, i.start();
  const s = new GainNode(r, { gain: t });
  return i.connect(s), { node: s, stop: (u) => i.stop(u) };
}, lC = (e, t, n, r = "sine") => {
  const s = e.value * t, u = s * n;
  return cC(s, u, r);
};
function ki(e, t, n) {
  const {
    fmh: r = 1,
    fmi: i,
    fmenv: s = "exp",
    fmattack: u,
    fmdecay: a,
    fmsustain: o,
    fmrelease: f,
    fmvelocity: h,
    fmwave: m = "sine",
    duration: p
  } = t;
  let A, M = () => {
  };
  if (i) {
    const E = Ee().createGain(), k = lC(e, r, i, m);
    if (A = k.node, M = k.stop, ![u, a, o, f, h].find((_) => _ !== void 0))
      A.connect(e);
    else {
      const [_, G, S, x] = tn([u, a, o, f]), B = n + p;
      en(
        E.gain,
        _,
        G,
        S,
        x,
        0,
        1,
        n,
        B,
        s === "exp" ? "exponential" : "linear"
      ), A.connect(E), E.connect(e);
    }
  }
  return { stop: M };
}
let Xt = [], Bn = 0;
const gi = 4;
let fC = (e) => {
  let t = [], n = {
    get() {
      return n.lc || n.listen(() => {
      })(), n.value;
    },
    lc: 0,
    listen(r) {
      return n.lc = t.push(r), () => {
        for (let s = Bn + gi; s < Xt.length; )
          Xt[s] === r ? Xt.splice(s, gi) : s += gi;
        let i = t.indexOf(r);
        ~i && (t.splice(i, 1), --n.lc || n.off());
      };
    },
    notify(r, i) {
      let s = !Xt.length;
      for (let u of t)
        Xt.push(
          u,
          n.value,
          r,
          i
        );
      if (s) {
        for (Bn = 0; Bn < Xt.length; Bn += gi)
          Xt[Bn](
            Xt[Bn + 1],
            Xt[Bn + 2],
            Xt[Bn + 3]
          );
        Xt.length = 0;
      }
    },
    /* It will be called on last listener unsubscribing.
       We will redefine it in onMount and onStop. */
    off() {
    },
    set(r) {
      let i = n.value;
      i !== r && (n.value = r, n.notify(i));
    },
    subscribe(r) {
      let i = n.listen(r);
      return r(n.value), i;
    },
    value: e
  };
  return n;
}, hC = (e = {}) => {
  let t = fC(e);
  return t.setKey = function(n, r) {
    let i = t.value;
    typeof r > "u" && n in t.value ? (t.value = { ...t.value }, delete t.value[n], t.notify(i, n)) : t.value[n] !== r && (t.value = {
      ...t.value,
      [n]: r
    }, t.notify(i, n));
  }, t;
};
const Hu = {}, Ps = {}, pC = (e) => Hu[e];
function dC(e, t) {
  var n = 1024;
  if (e < n) return e + " B";
  var r = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], i = -1;
  do
    e /= n, ++i;
  while (e >= n);
  return e.toFixed(1) + " " + r[i];
}
function Hp(e, t) {
  const { s: n, n: r = 0, speed: i = 1 } = e;
  let s = uC(e, 36), u = s - 36, a, o = 0;
  if (Array.isArray(t))
    o = no(r, t.length), a = t[o];
  else {
    const m = (A) => $i(A) - s, p = Object.keys(t).filter((A) => !A.startsWith("_")).reduce(
      (A, M, v) => !A || Math.abs(m(M)) < Math.abs(m(A)) ? M : A,
      null
    );
    u = -m(p), o = no(r, t[p].length), a = t[p][o];
  }
  const f = `${n}:${o}`;
  let h = Math.abs(i) * Math.pow(2, u / 12);
  return { transpose: u, sampleUrl: a, index: o, midi: s, label: f, playbackRate: h };
}
const Jp = async (e, t, n) => {
  let { sampleUrl: r, label: i, playbackRate: s } = Hp(e, t);
  n && (r = await n(r));
  const u = Ee(), a = await Ju(r, u, i);
  return e.unit === "c" && (s = s * a.duration), { buffer: a, playbackRate: s };
}, Yp = async (e, t, n) => {
  let { buffer: r, playbackRate: i } = await Jp(e, t, n);
  e.speed < 0 && (r = Up(r));
  const u = Ee().createBufferSource();
  u.buffer = r, u.playbackRate.value = i;
  const { s: a, loopBegin: o = 0, loopEnd: f = 1, begin: h = 0, end: m = 1 } = e, p = h * u.buffer.duration;
  (a.startsWith("wt_") ? 1 : e.loop) && (u.loop = !0, u.loopStart = o * u.buffer.duration - p, u.loopEnd = f * u.buffer.duration - p);
  const M = u.buffer.duration / u.playbackRate.value, v = (m - h) * M;
  return { bufferSource: u, offset: p, bufferDuration: M, sliceDuration: v };
}, Ju = (e, t, n, r = 0) => {
  const i = n ? `sound "${n}:${r}"` : "sample";
  if (e = e.replace("#", "%23"), !Ps[e]) {
    xt(`[sampler] load ${i}..`, "load-sample", { url: e });
    const s = Date.now();
    Ps[e] = fetch(e).then((u) => u.arrayBuffer()).then(async (u) => {
      const a = Date.now() - s, o = dC(u.byteLength);
      xt(`[sampler] load ${i}... done! loaded ${o} in ${a}ms`, "loaded-sample", { url: e });
      const f = await t.decodeAudioData(u);
      return Hu[e] = f, f;
    });
  }
  return Ps[e];
};
function Up(e) {
  const t = Ee(), n = t.createBuffer(e.numberOfChannels, e.length, t.sampleRate);
  for (let r = 0; r < e.numberOfChannels; r++)
    n.copyToChannel(e.getChannelData(r).slice().reverse(), r, r);
  return n;
}
const mC = (e) => Hu[e];
function Qp(e) {
  if (e.startsWith("bubo:")) {
    const [t, n] = e.split(":");
    e = `github:Bubobubobubobubo/dough-${n}`;
  }
  return e;
}
function ed(e, t = "") {
  if (!e.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let [n, r] = e.split("github:");
  return r = r.endsWith("/") ? r.slice(0, -1) : r, r.split("/").length === 2 && (r += "/main"), `https://raw.githubusercontent.com/${r}/${t}`;
}
const td = (e, t, n = e._base || "") => Object.entries(e).forEach(([r, i]) => {
  if (typeof i == "string" && (i = [i]), typeof i != "object")
    throw new Error("wrong sample map format for " + r);
  n = i._base || n, n = Qp(n), n.startsWith("github:") && (n = ed(n, ""));
  const s = (u) => n + u;
  Array.isArray(i) ? i = i.map(s) : i = Object.fromEntries(
    Object.entries(i).map(([u, a]) => [u, (typeof a == "string" ? [a] : a).map(s)])
  ), t(r, i);
});
let nd = {};
function gC(e, t) {
  nd[e] = t;
}
function yC(e) {
  const t = Object.entries(nd).find(([n]) => e.startsWith(n));
  if (t)
    return t[1];
}
const rd = async (e, t = e._base || "", n = {}) => {
  if (typeof e == "string") {
    const s = yC(e);
    if (s)
      return s(e);
    if (e = Qp(e), e.startsWith("github:") && (e = ed(e, "strudel.json")), e.startsWith("local:") && (e = "http://localhost:5432"), e.startsWith("shabda:")) {
      let [a, o] = e.split("shabda:");
      e = `https://shabda.ndre.gr/${o}.json?strudel=1`;
    }
    if (e.startsWith("shabda/speech")) {
      let [a, o] = e.split("shabda/speech");
      o = o.startsWith("/") ? o.substring(1) : o;
      let [f, h] = o.split(":"), m = "f", p = "en-GB";
      f && ([p, m] = f.split("/")), e = `https://shabda.ndre.gr/speech/${h}.json?gender=${m}&language=${p}&strudel=1'`;
    }
    if (typeof fetch != "function")
      return;
    const u = e.split("/").slice(0, -1).join("/");
    return typeof fetch > "u" ? void 0 : fetch(e).then((a) => a.json()).then((a) => rd(a, t || a._base || u, n)).catch((a) => {
      throw console.error(a), new Error(`error loading "${e}"`);
    });
  }
  const { prebake: r, tag: i } = n;
  td(
    e,
    (s, u) => In(s, (a, o, f) => id(a, o, f, u), {
      type: "sample",
      samples: u,
      baseUrl: t,
      prebake: r,
      tag: i
    }),
    t
  );
}, so = [];
async function id(e, t, n, r, i) {
  let {
    s,
    nudge: u = 0,
    // TODO: is this in seconds?
    cut: a,
    loop: o,
    clip: f = void 0,
    // if set, samples will be cut off when the hap ends
    n: h = 0,
    speed: m = 1,
    // sample playback speed
    duration: p
  } = t;
  if (m === 0)
    return;
  const A = Ee();
  let [M, v, E, k] = tn([t.attack, t.decay, t.sustain, t.release]);
  const { bufferSource: _, sliceDuration: G, offset: S } = await Yp(t, r, i);
  if (A.currentTime > e) {
    xt(`[sampler] still loading sound "${s}:${h}"`, "highlight");
    return;
  }
  if (!_) {
    xt(`[sampler] could not load "${s}:${h}"`, "error");
    return;
  }
  let x = Ur(_.detune, t, e);
  const B = e + u;
  _.start(B, S);
  const I = A.createGain(), V = _.connect(I);
  f == null && o == null && t.release == null && (p = G);
  let q = e + p;
  en(V.gain, M, v, E, k, 0, 1, e, q, "linear"), Yr(_.detune, t, e, q);
  const X = A.createGain();
  V.connect(X), _.onended = function() {
    _.disconnect(), x?.stop(), V.disconnect(), X.disconnect(), n();
  };
  let U = q + k + 0.01;
  _.stop(U);
  const W = { node: X, bufferSource: _, stop: (ee) => {
    _.stop(ee);
  } };
  if (a !== void 0) {
    const ee = so[a];
    ee && (ee.node.gain.setValueAtTime(1, B), ee.node.gain.linearRampToValueAtTime(0, B + 0.01)), so[a] = W;
  }
  return W;
}
const Yu = 128, au = "System Standard";
let sd = Yu;
function ud(e) {
  sd = parseInt(e) ?? Yu;
}
let ad = !1;
function od(e) {
  ad = e == !0;
}
const dr = hC();
function In(e, t, n = {}) {
  e = e.toLowerCase().replace(/\s+/g, "_"), dr.setKey(e, { onTrigger: t, data: n });
}
let cd = (e) => e;
function On(e) {
  return cd(e);
}
function bC(e) {
  cd = e;
}
function ou(e) {
  for (const n in e)
    e[n.toLowerCase()] = e[n];
  const t = dr.get();
  for (const n in t) {
    const [r, i] = n.split("_");
    if (!i) continue;
    const s = e[r];
    if (s) {
      if (typeof s == "string")
        t[`${s}_${i}`.toLowerCase()] = t[n];
      else if (Array.isArray(s))
        for (const u of s)
          t[`${u}_${i}`.toLowerCase()] = t[n];
    }
  }
  dr.set({ ...t });
}
async function AC(e) {
  const n = await (await fetch(e)).json();
  ou(n);
}
async function MC(...e) {
  switch (e.length) {
    case 1:
      return typeof e[0] == "string" ? AC(e[0]) : ou(e[0]);
    case 2:
      return ou({ [e[0]]: e[1] });
    default:
      throw new Error("aliasMap expects 1 or 2 arguments, received " + e.length);
  }
}
function Pi(e) {
  return dr.get()[e.toLowerCase()];
}
const ld = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: !0 });
  let e = await navigator.mediaDevices.enumerateDevices();
  e = e.filter((n) => n.kind === "audiooutput" && n.deviceId !== "default");
  const t = /* @__PURE__ */ new Map();
  return t.set(au, ""), e.forEach((n) => {
    t.set(n.label, n.deviceId);
  }), t;
}, fd = {
  s: "triangle",
  gain: 0.8,
  postgain: 1,
  density: ".03",
  ftype: "12db",
  fanchor: 0,
  resonance: 1,
  hresonance: 1,
  bandq: 1,
  channels: [1, 2],
  phaserdepth: 0.75,
  shapevol: 1,
  distortvol: 1,
  delay: 0,
  byteBeatExpression: "0",
  delayfeedback: 0.5,
  delaytime: 0.25,
  orbit: 1,
  i: 1,
  velocity: 1,
  fft: 8
};
let Uu = new Map(Object.entries(fd));
function Qu(e, t) {
  Uu.set(e, t);
}
function Ke(e) {
  return Uu.get(e);
}
function CC(e) {
  Object.keys(e).forEach((t) => {
    Qu(t, e[t]);
  });
}
function hd() {
  Uu = new Map(Object.entries(fd));
}
function vC(e) {
  hd(), e === "1.0" && Qu("fanchor", 0.5);
}
const PC = () => dr.set({});
let Ii;
const pd = () => (Ii = new AudioContext(), Ii), Ee = () => Ii || pd();
function DC() {
  return Ee().currentTime;
}
let Ds;
function FC() {
  return Ds || (Ds = Ee().audioWorklet.addModule(aC)), Ds;
}
async function dd(e = {}) {
  const {
    disableWorklets: t = !1,
    maxPolyphony: n,
    audioDeviceName: r = au,
    multiChannelOrbits: i = !1
  } = e;
  if (ud(n), od(i), typeof window > "u")
    return;
  const s = Ee();
  if (r != null && r != au)
    try {
      const a = (await ld()).get(r), o = (a ?? "").length > 0;
      s.sinkId !== a && o && await s.setSinkId(a), xt(
        `[superdough] Audio Device set to ${r}, it might take a few seconds before audio plays on all output channels`
      );
    } catch {
      xt("[superdough] failed to set audio interface", "warning");
    }
  if (await s.resume(), t) {
    xt("[superdough]: AudioWorklets disabled with disableWorklets");
    return;
  }
  try {
    await FC(), xt("[superdough] AudioWorklets loaded");
  } catch (u) {
    console.warn("could not load AudioWorklet effects", u);
  }
  xt("[superdough] ready");
}
let Fs;
async function md(e) {
  return Fs || (Fs = new Promise((t) => {
    document.addEventListener("click", async function n() {
      document.removeEventListener("click", n), await dd(e), t();
    });
  })), Fs;
}
let kn = {}, Vi, fr;
function gd() {
  const e = Ee(), t = e.destination.maxChannelCount;
  e.destination.channelCount = t, Vi = new ChannelMergerNode(e, { numberOfInputs: e.destination.channelCount }), fr = new GainNode(e), Vi.connect(fr), fr.connect(e.destination);
}
const qi = (e, t = [0, 1]) => {
  const n = Ee();
  Vi == null && gd();
  const r = new StereoPannerNode(n);
  e.connect(r);
  const i = new ChannelSplitterNode(n, {
    numberOfOutputs: r.channelCount
  });
  r.connect(i), t.forEach((s, u) => {
    i.connect(Vi, u % r.channelCount, s % n.destination.channelCount);
  });
}, EC = () => {
  fr != null && (fr.gain.linearRampToValueAtTime(0, Ee().currentTime + 0.01), fr = null);
};
function xC(e, t, n, r, i) {
  if (n = Jr(n, 0, 0.98), !kn[e]) {
    const u = Ee().createFeedbackDelay(1, t, n);
    u.start?.(r), qi(u, i), kn[e] = u;
  }
  return kn[e].delayTime.value !== t && kn[e].delayTime.setValueAtTime(t, r), kn[e].feedback.value !== n && kn[e].feedback.setValueAtTime(n, r), kn[e];
}
function ea(e, t, n, r = {}) {
  return Wt(e, "lfo-processor", {
    frequency: 1,
    depth: 1,
    skew: 0,
    phaseoffset: 0,
    time: t,
    end: n,
    shape: 1,
    dcoffset: -0.5,
    ...r
  });
}
function wC(e, t, n = 1, r = 0.5, i = 1e3, s = 2e3) {
  const u = Ee(), a = ea(u, e, t, { frequency: n, depth: s * 2 }), o = 2;
  let f = 0;
  const h = [];
  for (let m = 0; m < o; m++) {
    const p = u.createBiquadFilter();
    p.type = "notch", p.gain.value = 1, p.frequency.value = i + f, p.Q.value = 2 - Math.min(Math.max(r * 2, 0), 1.9), a.connect(p.detune), f += 282, m > 0 && h[m - 1].connect(p), h.push(p);
  }
  return h[h.length - 1];
}
function SC(e) {
  e = e ?? 0;
  const t = ["12db", "ladder", "24db"];
  return typeof e == "number" ? t[Math.floor($p(e, t.length))] : e;
}
let Ut = {}, yi = (e, t) => e !== void 0 && e !== t;
function BC(e, t, n, r, i, s, u) {
  if (!Ut[e]) {
    const o = Ee().createReverb(t, n, r, i, s);
    qi(o, u), Ut[e] = o;
  }
  return (yi(t, Ut[e].duration) || yi(n, Ut[e].fade) || yi(r, Ut[e].lp) || yi(i, Ut[e].dim) || Ut[e].ir !== s) && Ut[e].generate(t, n, r, i, s), Ut[e];
}
let at = {}, jn = {};
function yd(e, t = 1024, n = 0.5) {
  if (!at[e]) {
    const r = Ee().createAnalyser();
    r.fftSize = t, r.smoothingTimeConstant = n, at[e] = r, jn[e] = new Float32Array(at[e].frequencyBinCount);
  }
  return at[e].fftSize !== t && (at[e].fftSize = t, jn[e] = new Float32Array(at[e].frequencyBinCount)), at[e];
}
function Ki(e = "time", t = 1) {
  const n = {
    time: () => at[t]?.getFloatTimeDomainData(jn[t]),
    frequency: () => at[t]?.getFloatFrequencyData(jn[t])
  }[e];
  if (!n)
    throw new Error(`getAnalyzerData: ${e} not supported. use one of ${Object.keys(n).join(", ")}`);
  return n(), jn[t];
}
function Es(e, t, n) {
  const r = Qt(n);
  return e.connect(r), r.connect(t), r;
}
function _C() {
  kn = {}, Ut = {}, at = {}, jn = {};
}
let Nr = /* @__PURE__ */ new Map();
function uo(e) {
  return (Array.isArray(e) ? e : [e]).map((t) => t - 1);
}
const Hi = async (e, t, n, r) => {
  const i = Ee();
  t = typeof t == "string" && t.startsWith("=") ? Number(t.slice(1)) : i.currentTime + t;
  let { stretch: s } = e;
  if (s != null && (t = t - 0.04), typeof e != "object")
    throw new Error(
      `expected hap.value to be an object, but got "${e}". Hint: append .note() or .s() to the end`,
      "error"
    );
  if (e.duration = n, t < i.currentTime) {
    console.warn(
      `[superdough]: cannot schedule sounds in the past (target: ${t.toFixed(2)}, now: ${i.currentTime.toFixed(2)})`
    );
    return;
  }
  let {
    s: u = Ke("s"),
    bank: a,
    source: o,
    gain: f = Ke("gain"),
    postgain: h = Ke("postgain"),
    density: m = Ke("density"),
    // filters
    fanchor: p = Ke("fanchor"),
    drive: A = 0.69,
    // low pass
    cutoff: M,
    lpenv: v,
    lpattack: E,
    lpdecay: k,
    lpsustain: _,
    lprelease: G,
    resonance: S = Ke("resonance"),
    // high pass
    hpenv: x,
    hcutoff: B,
    hpattack: I,
    hpdecay: V,
    hpsustain: q,
    hprelease: X,
    hresonance: U = Ke("hresonance"),
    // band pass
    bpenv: O,
    bandf: W,
    bpattack: ee,
    bpdecay: be,
    bpsustain: pe,
    bprelease: le,
    bandq: ie = Ke("bandq"),
    //phaser
    phaserrate: Ie,
    phaserdepth: oe = Ke("phaserdepth"),
    phasersweep: ge,
    phasercenter: $,
    //
    coarse: Pe,
    crush: it,
    shape: ze,
    shapevol: Ae = Ke("shapevol"),
    distort: qe,
    distortvol: xe = Ke("distortvol"),
    pan: je,
    vowel: Ct,
    delay: ut = Ke("delay"),
    delayfeedback: Ve = Ke("delayfeedback"),
    delaytime: cn = Ke("delaytime"),
    orbit: _e = Ke("orbit"),
    room: Kt,
    roomfade: Vt,
    roomlp: Nt,
    roomdim: ln,
    roomsize: Wn,
    ir: Ht,
    i: fn = Ke("i"),
    velocity: Jt = Ke("velocity"),
    analyze: yt,
    // analyser wet
    fft: En = Ke("fft"),
    // fftSize 0 - 10
    compressor: ye,
    compressorRatio: Ze,
    compressorKnee: ue,
    compressorAttack: We,
    compressorRelease: ke
  } = e;
  const xn = uo(
    ad && _e > 0 ? [_e * 2 - 1, _e * 2] : Ke("channels")
  ), _r = e.channels != null ? uo(e.channels) : xn;
  f = On(Mn(f, 1)), h = On(h), Ae = On(Ae), xe = On(xe), ut = On(ut), Jt = On(Jt), f *= Jt;
  const ct = Math.round(Math.random() * 1e6);
  for (let Me = 0; Me <= Nr.size - sd; Me++) {
    const vt = Nr.entries().next(), lt = vt.value[1], ft = vt.value[0], c = t + 0.25;
    lt?.node?.gain?.linearRampToValueAtTime(0, c), lt?.stop?.(c), Nr.delete(ft);
  }
  let Tt = [];
  a && u && (u = `${a}_${u}`, e.s = u);
  let bt;
  if (o)
    bt = o(t, e, n, r);
  else if (Pi(u)) {
    const { onTrigger: Me } = Pi(u), lt = await Me(t, e, () => {
      Tt.forEach((ft) => ft?.disconnect()), Nr.delete(ct);
    });
    lt && (bt = lt.node, Nr.set(ct, lt));
  } else
    throw new Error(`sound ${u} not found! Is it loaded?`);
  if (!bt)
    return;
  if (i.currentTime > t) {
    xt("[webaudio] skip hap: still loading", i.currentTime - t);
    return;
  }
  const fe = [];
  fe.push(bt), s !== void 0 && fe.push(Wt(i, "phase-vocoder-processor", { pitchFactor: s })), fe.push(Qt(f));
  const hn = SC(e.ftype);
  if (M !== void 0) {
    let Me = () => Ci(
      i,
      "lowpass",
      M,
      S,
      E,
      k,
      _,
      G,
      v,
      t,
      t + n,
      p,
      hn,
      A
    );
    fe.push(Me()), hn === "24db" && fe.push(Me());
  }
  if (B !== void 0) {
    let Me = () => Ci(
      i,
      "highpass",
      B,
      U,
      I,
      V,
      q,
      X,
      x,
      t,
      t + n,
      p
    );
    fe.push(Me()), hn === "24db" && fe.push(Me());
  }
  if (W !== void 0) {
    let Me = () => Ci(
      i,
      "bandpass",
      W,
      ie,
      ee,
      be,
      pe,
      le,
      O,
      t,
      t + n,
      p
    );
    fe.push(Me()), hn === "24db" && fe.push(Me());
  }
  if (Ct !== void 0) {
    const Me = i.createVowelFilter(Ct);
    fe.push(Me);
  }
  if (Pe !== void 0 && fe.push(Wt(i, "coarse-processor", { coarse: Pe })), it !== void 0 && fe.push(Wt(i, "crush-processor", { crush: it })), ze !== void 0 && fe.push(Wt(i, "shape-processor", { shape: ze, postgain: Ae })), qe !== void 0 && fe.push(Wt(i, "distort-processor", { distort: qe, postgain: xe })), ye !== void 0 && fe.push(
    qp(i, ye, Ze, ue, We, ke)
  ), je !== void 0) {
    const Me = i.createStereoPanner();
    Me.pan.value = 2 * je - 1, fe.push(Me);
  }
  if (Ie !== void 0 && oe > 0) {
    const Me = wC(t, t + n, Ie, oe, $, ge);
    fe.push(Me);
  }
  const pn = new GainNode(i, { gain: h });
  fe.push(pn), qi(pn, _r);
  let Ne;
  if (ut > 0 && cn > 0 && Ve > 0) {
    const Me = xC(_e, cn, Ve, t, xn);
    Ne = Es(pn, Me, ut), Tt.push(Ne);
  }
  let Qe;
  if (Kt > 0) {
    let Me;
    if (Ht !== void 0) {
      let lt, ft = Pi(Ht);
      Array.isArray(ft) ? lt = ft.data.samples[fn % ft.data.samples.length] : typeof ft == "object" && (lt = Object.values(ft.data.samples).flat()[fn % Object.values(ft.data.samples).length]), Me = await Ju(lt, i, Ht, 0);
    }
    const vt = BC(_e, Wn, Vt, Nt, ln, Me, xn);
    Qe = Es(pn, vt, Kt), Tt.push(Qe);
  }
  let Yt;
  if (yt) {
    const Me = yd(yt, 2 ** (En + 5));
    Yt = Es(pn, Me, 1), Tt.push(Yt);
  }
  fe.slice(1).reduce((Me, vt) => Me.connect(vt), fe[0]), Tt = Tt.concat(fe);
}, kC = (e, t, n, r) => {
  Hi(t, e - n, t.duration / r, r);
};
let xs = {};
function IC(e, t) {
  const n = Ee();
  if (xs[e])
    return xs[e];
  const r = 2 * n.sampleRate, i = n.createBuffer(1, r, n.sampleRate), s = i.getChannelData(0);
  let u = 0, a, o, f, h, m, p, A;
  a = o = f = h = m = p = A = 0;
  for (let M = 0; M < r; M++)
    if (e === "white")
      s[M] = Math.random() * 2 - 1;
    else if (e === "brown") {
      let v = Math.random() * 2 - 1;
      s[M] = (u + 0.02 * v) / 1.02, u = s[M];
    } else if (e === "pink") {
      let v = Math.random() * 2 - 1;
      a = 0.99886 * a + v * 0.0555179, o = 0.99332 * o + v * 0.0750759, f = 0.969 * f + v * 0.153852, h = 0.8665 * h + v * 0.3104856, m = 0.55 * m + v * 0.5329522, p = -0.7616 * p - v * 0.016898, s[M] = a + o + f + h + m + p + A + v * 0.5362, s[M] *= 0.11, A = v * 0.115926;
    } else if (e === "crackle") {
      const v = t * 0.01;
      Math.random() < v ? s[M] = Math.random() * 2 - 1 : s[M] = 0;
    }
  return e !== "crackle" && (xs[e] = i), i;
}
function bd(e = "white", t, n = 0.02) {
  const i = Ee().createBufferSource();
  return i.buffer = IC(e, n), i.loop = !0, i.start(t), {
    node: i,
    stop: (s) => i.stop(s)
  };
}
function VC(e, t, n) {
  const r = bd("pink", n);
  return {
    node: Kp(e, r.node, t),
    stop: (s) => r?.stop(s)
  };
}
const Di = (e) => {
  let { note: t, freq: n } = e;
  return t = t || 36, typeof t == "string" && (t = $i(t)), !n && typeof t == "number" && (n = jp(t)), Number(n);
};
function bi(e) {
  e != null && (e.disconnect(), e.parameters.get("end")?.setValueAtTime(0, 0));
}
const NC = ["triangle", "square", "sawtooth", "sine"], TC = ["pink", "white", "brown", "crackle"];
function Ad() {
  [...NC].forEach((e) => {
    In(
      e,
      (t, n, r) => {
        const [i, s, u, a] = tn(
          [n.attack, n.decay, n.sustain, n.release],
          "linear",
          [1e-3, 0.05, 0.6, 0.01]
        );
        let o = Cd(e, t, n), { node: f, stop: h, triggerRelease: m } = o;
        const p = Qt(0.3), { duration: A } = n;
        f.onended = () => {
          f.disconnect(), p.disconnect(), r();
        };
        const M = Qt(1);
        let v = f.connect(p).connect(M);
        const E = t + A;
        en(v.gain, i, s, u, a, 0, 1, t, E, "linear");
        const k = E + a + 0.01;
        return m?.(k), h(k), {
          node: v,
          stop: (_) => {
            h(_);
          }
        };
      },
      { type: "synth", prebake: !0 }
    );
  }), In(
    "supersaw",
    (e, t, n) => {
      const r = Ee();
      let { duration: i, n: s, unison: u = 5, spread: a = 0.6, detune: o } = t;
      o = o ?? s ?? 0.18;
      const f = Di(t), [h, m, p, A] = tn(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), M = e + i, v = M + A + 0.01, E = Jr(u, 1, 100);
      let k = E > 1 ? Jr(a, 0, 1) : 0, _ = Wt(
        r,
        "supersaw-oscillator",
        {
          frequency: f,
          begin: e,
          end: v,
          freqspread: o,
          voices: E,
          panspread: k
        },
        {
          outputChannelCount: [2]
        }
      );
      const G = 1 / Math.sqrt(E);
      Yr(_.parameters.get("detune"), t, e, M);
      const S = Ur(_.parameters.get("detune"), t, e), x = ki(_.parameters.get("frequency"), t, e);
      let B = Qt(1);
      B = _.connect(B), en(B.gain, h, m, p, A, 0, 0.3 * G, e, M, "linear");
      let I = vi(
        r,
        () => {
          bi(_), B.disconnect(), n(), x?.stop(), S?.stop();
        },
        e,
        v
      );
      return {
        node: B,
        stop: (V) => {
          I.stop(V);
        }
      };
    },
    { prebake: !0, type: "synth" }
  ), In(
    "bytebeat",
    (e, t, n) => {
      const r = [
        "(t%255 >= t/255%255)*255",
        "(t*(t*8%60 <= 300)|(-t)*(t*4%512 < 256))+t/400",
        "t",
        "t*(t >> 10^t)",
        "t&128",
        "t&t>>8",
        "((t%255+t%128+t%64+t%32+t%16+t%127.8+t%64.8+t%32.8+t%16.8)/3)",
        "((t%64+t%63.8+t%64.15+t%64.35+t%63.5)/1.25)",
        "(t&(t>>7)-t)",
        "(sin(t*PI/128)*127+127)",
        "((t^t/2+t+64*(sin((t*PI/64)+(t*PI/32768))+64))%128*2)",
        "((t^t/2+t+64*(cos >> 0))%127.85*2)",
        "((t^t/2+t+64)%128*2)",
        "(((t * .25)^(t * .25)/100+(t * .25))%128)*2",
        "((t^t/2+t+64)%7 * 24)"
      ], { n: i = 0 } = t, s = Di(t), { byteBeatExpression: u = r[i % r.length], byteBeatStartTime: a } = t, o = Ee();
      let { duration: f } = t;
      const [h, m, p, A] = tn(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), M = e + f, v = M + A + 0.01;
      let E = Wt(
        o,
        "byte-beat-processor",
        {
          frequency: s,
          begin: e,
          end: v
        },
        {
          outputChannelCount: [2]
        }
      );
      E.port.postMessage({ codeText: u, byteBeatStartTime: a, frequency: s });
      let k = Qt(1);
      k = E.connect(k), en(k.gain, h, m, p, A, 0, 1, e, M, "linear");
      let _ = vi(
        o,
        () => {
          bi(E), k.disconnect(), n();
        },
        e,
        v
      );
      return {
        node: k,
        stop: (G) => {
          _.stop(G);
        }
      };
    },
    { prebake: !0, type: "synth" }
  ), In(
    "pulse",
    (e, t, n) => {
      const r = Ee();
      let { pwrate: i, pwsweep: s } = t;
      s == null && (i != null ? s = 0.3 : s = 0), i == null && s != null && (i = 1);
      let { duration: u, pw: a = 0.5 } = t;
      const o = Di(t), [f, h, m, p] = tn(
        [t.attack, t.decay, t.sustain, t.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), A = e + u, M = A + p + 0.01;
      let v = Wt(
        r,
        "pulse-oscillator",
        {
          frequency: o,
          begin: e,
          end: M,
          pulsewidth: a
        },
        {
          outputChannelCount: [2]
        }
      );
      Yr(v.parameters.get("detune"), t, e, A);
      const E = Ur(v.parameters.get("detune"), t, e), k = ki(v.parameters.get("frequency"), t, e);
      let _ = Qt(1);
      _ = v.connect(_), en(_.gain, f, h, m, p, 0, 1, e, A, "linear");
      let G;
      s != 0 && (G = ea(r, e, M, { frequency: i, depth: s }), G.connect(v.parameters.get("pulsewidth")));
      let S = vi(
        r,
        () => {
          bi(v), bi(G), _.disconnect(), n(), k?.stop(), E?.stop();
        },
        e,
        M
      );
      return {
        node: _,
        stop: (x) => {
          S.stop(x);
        }
      };
    },
    { prebake: !0, type: "synth" }
  ), [...TC].forEach((e) => {
    In(
      e,
      (t, n, r) => {
        const [i, s, u, a] = tn(
          [n.attack, n.decay, n.sustain, n.release],
          "linear",
          [1e-3, 0.05, 0.6, 0.01]
        );
        let o, { density: f } = n;
        o = bd(e, t, f);
        let { node: h, stop: m, triggerRelease: p } = o;
        const A = Qt(0.3), { duration: M } = n;
        h.onended = () => {
          h.disconnect(), A.disconnect(), r();
        };
        const v = Qt(1);
        let E = h.connect(A).connect(v);
        const k = t + M;
        en(E.gain, i, s, u, a, 0, 1, t, k, "linear");
        const _ = k + a + 0.01;
        return p?.(_), m(_), {
          node: E,
          stop: (G) => {
            m(G);
          }
        };
      },
      { type: "synth", prebake: !0 }
    );
  });
}
function Md(e, t) {
  const n = new Float32Array(e + 1), r = new Float32Array(e + 1), i = Ee(), s = i.createOscillator(), u = {
    sawtooth: (f) => [0, -1 / f],
    square: (f) => [0, f % 2 === 0 ? 0 : 1 / f],
    triangle: (f) => [f % 2 === 0 ? 0 : 1 / (f * f), 0]
  };
  if (!u[t])
    throw new Error(`unknown wave type ${t}`);
  n[0] = 0, r[0] = 0;
  let a = 1;
  for (; a <= e; ) {
    const [f, h] = u[t](a);
    n[a] = f, r[a] = h, a++;
  }
  const o = i.createPeriodicWave(n, r);
  return s.setPeriodicWave(o), s;
}
function Cd(e, t, n) {
  let { n: r, duration: i, noise: s = 0 } = n, u;
  !r || e === "sine" ? (u = Ee().createOscillator(), u.type = e || "triangle") : u = Md(r, e), u.frequency.value = Di(n), u.start(t);
  let a = Ur(u.detune, n, t);
  Yr(u.detune, n, t, t + i);
  const o = ki(u.frequency, n, t);
  let f;
  return s && (f = VC(u, s, t)), {
    node: f?.node || u,
    stop: (h) => {
      o.stop(h), a?.stop(h), f?.stop(h), u.stop(h);
    },
    triggerRelease: (h) => {
    }
  };
}
function LC(e = 1, t = 0.05, n = 220, r = 0, i = 0, s = 0.1, u = 0, a = 1, o = 0, f = 0, h = 0, m = 0, p = 0, A = 0, M = 0, v = 0, E = 0, k = 1, _ = 0, G = 0) {
  let S = Math.PI * 2, x = Ee().sampleRate, B = (Ie) => Ie > 0 ? 1 : -1, I = o *= 500 * S / x / x, V = n *= (1 + t * 2 * Math.random() - t) * S / x, q = [], X = 0, U = 0, O = 0, W = 1, ee = 0, be = 0, pe = 0, le, ie;
  for (r = r * x + 9, _ *= x, i *= x, s *= x, E *= x, f *= 500 * S / x ** 3, M *= S / x, h *= S / x, m *= x, p = p * x | 0, ie = r + _ + i + s + E | 0; O < ie; q[O++] = pe)
    ++be % (v * 100 | 0) || (pe = u ? u > 1 ? u > 2 ? u > 3 ? Math.sin((X % S) ** 3) : Math.max(Math.min(Math.tan(X), 1), -1) : 1 - (2 * X / S % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(X / S) - X / S) : Math.sin(X), pe = (p ? 1 - G + G * Math.sin(S * O / p) : 1) * B(pe) * Math.abs(pe) ** a * // curve 0=square, 2=pointy
    e * 1 * // envelope
    (O < r ? O / r : O < r + _ ? 1 - (O - r) / _ * (1 - k) : O < r + _ + i ? k : O < ie - E ? (ie - O - E) / s * // release falloff
    k : 0), pe = E ? pe / 2 + (E > O ? 0 : (O < ie - E ? 1 : (ie - O) / E) * // release delay
    q[O - E | 0] / 2) : pe), le = (n += o += f) * // frequency
    Math.cos(M * U++), X += le - le * A * (1 - (Math.sin(O) + 1) * 1e9 % 2), W && ++W > m && (n += h, V += h, W = 0), p && !(++ee % p) && (n = V, o = I, W ||= 1);
  return q;
}
const vd = (e, t) => {
  let {
    s: n,
    note: r = 36,
    freq: i,
    //
    zrand: s = 0,
    attack: u = 0,
    decay: a = 0,
    sustain: o = 0.8,
    release: f = 0.1,
    curve: h = 1,
    slide: m = 0,
    deltaSlide: p = 0,
    pitchJump: A = 0,
    pitchJumpTime: M = 0,
    lfo: v = 0,
    znoise: E = 0,
    zmod: k = 0,
    zcrush: _ = 0,
    zdelay: G = 0,
    tremolo: S = 0,
    duration: x = 0.2,
    zzfx: B
  } = e;
  const I = Math.max(x - u - a, 0);
  typeof r == "string" && (r = $i(r)), !i && typeof r == "number" && (i = jp(r)), n = n.replace("z_", "");
  const V = ["sine", "triangle", "sawtooth", "tan", "noise"].indexOf(n) || 0;
  h = n === "square" ? 0 : h;
  const X = (
    /* ZZFX. */
    LC(...B || [
      0.25,
      // volume
      s,
      i,
      u,
      I,
      f,
      V,
      h,
      m,
      p,
      A,
      M,
      v,
      E,
      k,
      _,
      G,
      o,
      // sustain volume!
      a,
      S
    ])
  ), U = Ee(), O = U.createBuffer(1, X.length, U.sampleRate);
  O.getChannelData(0).set(X);
  const W = Ee().createBufferSource();
  return W.buffer = O, W.start(t), {
    node: W
  };
};
function RC() {
  ["zzfx", "z_sine", "z_sawtooth", "z_triangle", "z_square", "z_tan", "z_noise"].forEach((e) => {
    In(
      e,
      (t, n, r) => {
        const { node: i } = vd({ s: e, ...n }, t);
        return i.onended = () => {
          i.disconnect(), r();
        }, {
          node: i,
          stop: () => {
          }
        };
      },
      { type: "synth", prebake: !0 }
    );
  });
}
let hr;
async function Pd(e, t) {
  const n = `dsp-worklet-${Date.now()}`, r = `${t}
let __q = []; // trigger queue
class MyProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.t = 0;
    this.stopped = false;
    this.port.onmessage = (e) => {
      if(e.data==='stop') {
        this.stopped = true;
      } else if(e.data?.dough) {
        __q.push(e.data)
      } else {
        msg?.(e.data)
      }
    };
  }
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    if(__q.length) {
      for(let i=0;i<__q.length;++i) {
        const deadline = __q[i].time-currentTime;
        if(deadline<=0) {
          trigger(__q[i].dough)
          __q.splice(i,1)
        }
      }
    }
    for (let i = 0; i < output[0].length; i++) {
      const out = dsp(this.t / sampleRate);
      output.forEach((channel) => {
        channel[i] = out;
      });
      this.t++;
    }
  return !this.stopped;
  }
}
registerProcessor('${n}', MyProcessor);
`, s = `data:text/javascript;base64,${btoa(r)}`;
  await e.audioWorklet.addModule(s);
  const u = new AudioWorkletNode(e, n);
  return { node: u, stop: () => u.port.postMessage("stop") };
}
const Dd = () => {
  hr && (hr?.stop(), hr?.node?.disconnect());
};
typeof window < "u" && window.addEventListener("message", (e) => {
  e.data === "strudel-stop" ? Dd() : e.data?.dough && hr?.node.port.postMessage(e.data);
});
const GC = async (e) => {
  const t = Ee();
  Dd(), hr = await Pd(t, e), hr.node.connect(t.destination);
};
function Fd(e, t, n, r, i) {
  window.postMessage({ time: i, dough: t.value, currentTime: n, duration: t.duration, cps: r });
}
const { Pattern: Ed, logger: XC, repl: ZC } = Wp;
zp(XC);
const xd = (e) => (e.ensureObjectValue(), e.value), wd = (e, t, n, r) => Hi(xd(t), e - n, t.duration / r, r), Sd = (e, t, n, r, i) => Hi(xd(e), i ? `=${i}` : t, n);
Ed.prototype.webaudio = function() {
  return this.onTrigger(wd);
};
function Bd(e = {}) {
  return e = {
    getTime: () => Ee().currentTime,
    defaultOutput: Sd,
    ...e
  }, ZC(e);
}
Ed.prototype.dough = function() {
  return this.onTrigger(Fd, 1);
};
const Qn = (e = "test-canvas", t) => {
  let { contextType: n = "2d", pixelated: r = !1, pixelRatio: i = window.devicePixelRatio } = {}, s = document.querySelector("#" + e);
  if (!s) {
    s = document.createElement("canvas"), s.id = e, s.width = window.innerWidth * i, s.height = window.innerHeight * i, s.style = "pointer-events:none;width:100%;height:100%;position:fixed;top:0;left:0", r && (s.style.imageRendering = "pixelated"), document.body.prepend(s);
    let u;
    window.addEventListener("resize", () => {
      u && clearTimeout(u), u = setTimeout(() => {
        s.width = window.innerWidth * i, s.height = window.innerHeight * i;
      }, 200);
    });
  }
  return s.getContext(n, { willReadFrequently: !0 });
};
let jr = {};
function WC(e) {
  jr[e] !== void 0 && (cancelAnimationFrame(jr[e]), delete jr[e]);
}
let bn = {};
z.prototype.draw = function(e, t) {
  if (typeof window > "u")
    return this;
  let { id: n = 1, lookbehind: r = 0, lookahead: i = 0 } = t, s = Math.max(uu(), 0);
  WC(n), r = Math.abs(r), bn[n] = (bn[n] || []).filter((f) => !f.isInFuture(s));
  let u = this.queryArc(s, s + i).filter((f) => f.hasOnset());
  bn[n] = bn[n].concat(u);
  let a;
  const o = () => {
    const f = uu(), h = f + i;
    bn[n] = bn[n].filter((A) => A.isInNearPast(r, f));
    let m = Math.max(a || h, h - 1 / 10);
    const p = this.queryArc(m, h).filter((A) => A.hasOnset());
    bn[n] = bn[n].concat(p), a = h, e(bn[n], f, h, this), jr[n] = requestAnimationFrame(o);
  };
  return jr[n] = requestAnimationFrame(o), this;
};
z.prototype.onPaint = function(e) {
  return this.withState((t) => {
    t.controls.painters || (t.controls.painters = []), t.controls.painters.push(e);
  });
};
z.prototype.getPainters = function() {
  let e = [];
  return this.queryArc(0, 0, { painters: e }), e;
};
let OC = {
  background: "#222",
  foreground: "#75baff",
  caret: "#ffcc00",
  selection: "rgba(128, 203, 196, 0.5)",
  selectionMatch: "#036dd626",
  lineHighlight: "#00000050",
  gutterBackground: "transparent",
  gutterForeground: "#8a919966"
};
function Cn() {
  return OC;
}
let ao = "#22222210";
z.prototype.animate = function({ callback: e, sync: t = !1, smear: n = 0.5 } = {}) {
  window.frame && cancelAnimationFrame(window.frame);
  const r = Qn();
  let { clientWidth: i, clientHeight: s } = r.canvas;
  i *= window.devicePixelRatio, s *= window.devicePixelRatio;
  let u = n === 0 ? "99" : Number((1 - n) * 100).toFixed(0);
  u = u.length === 1 ? `0${u}` : u, ao = `#200010${u}`;
  const a = (o) => {
    let f;
    o = Math.round(o), f = this.slow(1e3).queryArc(o, o), r.fillStyle = ao, r.fillRect(0, 0, i, s), f.forEach((h) => {
      let { x: m, y: p, w: A, h: M, s: v, r: E, angle: k = 0, fill: _ = "darkseagreen" } = h.value;
      if (A *= i, M *= s, E !== void 0 && k !== void 0) {
        const S = k * 2 * Math.PI, [x, B] = [(i - A) / 2, (s - M) / 2];
        m = x + Math.cos(S) * E * x, p = B + Math.sin(S) * E * B;
      } else
        m *= i - A, p *= s - M;
      const G = { ...h.value, x: m, y: p, w: A, h: M };
      r.fillStyle = _, v === "rect" ? r.fillRect(m, p, A, M) : v === "ellipse" && (r.beginPath(), r.ellipse(m + A / 2, p + M / 2, A / 2, M / 2, 0, 0, 2 * Math.PI), r.fill()), e && e(r, G, h);
    }), window.frame = requestAnimationFrame(a);
  };
  return window.frame = requestAnimationFrame(a), Be;
};
const { x: _d, y: EF, w: xF, h: wF, angle: SF, r: BF, fill: _F, smear: kF } = Nu("x", "y", "w", "h", "angle", "r", "fill", "smear");
T("rescale", function(e, t) {
  return t.mul(_d(e).w(e).y(e).h(e));
});
T("moveXY", function(e, t, n) {
  return n.add(_d(e).y(t));
});
T("zoomIn", function(e, t) {
  const n = Ye(1).sub(e).div(2);
  return t.rescale(e).move(n, n);
});
const Tr = (e, t, n) => e * (n - t) + t, oo = (e) => {
  let { value: t } = e;
  typeof e.value != "object" && (t = { value: t });
  let { note: n, n: r, freq: i, s } = t;
  if (i)
    return vu(i);
  if (n = n ?? r, typeof n == "string")
    try {
      return Rn(n);
    } catch {
      return 0;
    }
  return typeof n == "number" ? n : s ? "_" + s : t;
};
z.prototype.pianoroll = function(e = {}) {
  let { cycles: t = 4, playhead: n = 0.5, overscan: r = 0, hideNegative: i = !1, ctx: s = Qn(), id: u = 1 } = e, a = -t * n, o = t * (1 - n);
  const f = (h, m) => (!i || h.whole.begin >= 0) && h.isWithinTime(m + a, m + o);
  return this.draw(
    (h, m) => {
      kd({
        ...e,
        time: m,
        ctx: s,
        haps: h.filter((p) => f(p, m))
      });
    },
    {
      lookbehind: a - r,
      lookahead: o + r,
      id: u
    }
  ), this;
};
function kd({
  time: e,
  haps: t,
  cycles: n = 4,
  playhead: r = 0.5,
  flipTime: i = 0,
  flipValues: s = 0,
  hideNegative: u = !1,
  inactive: a = Cn().foreground,
  active: o = Cn().foreground,
  background: f = "transparent",
  smear: h = 0,
  playheadColor: m = Cn().foreground,
  minMidi: p = 10,
  maxMidi: A = 90,
  autorange: M = 0,
  timeframe: v,
  fold: E = 1,
  vertical: k = 0,
  labels: _ = !1,
  fill: G = 1,
  fillActive: S = !1,
  strokeActive: x = !0,
  stroke: B,
  hideInactive: I = 0,
  colorizeInactive: V = 1,
  fontFamily: q,
  ctx: X,
  id: U
} = {}) {
  const O = X.canvas.width, W = X.canvas.height;
  let ee = -n * r, be = n * (1 - r);
  U && (t = t.filter((xe) => xe.hasTag(U))), v && (console.warn("timeframe is deprecated! use from/to instead"), ee = 0, be = v);
  const pe = k ? W : O, le = k ? O : W;
  let ie = k ? [pe, 0] : [0, pe];
  const Ie = be - ee, oe = k ? [0, le] : [le, 0];
  let ge = A - p + 1, $ = le / ge, Pe = [];
  i && ie.reverse(), s && oe.reverse();
  const { min: it, max: ze, values: Ae } = t.reduce(
    ({ min: xe, max: je, values: Ct }, ut) => {
      const Ve = oo(ut);
      return {
        min: Ve < xe ? Ve : xe,
        max: Ve > je ? Ve : je,
        values: Ct.includes(Ve) ? Ct : [...Ct, Ve]
      };
    },
    { min: 1 / 0, max: -1 / 0, values: [] }
  );
  M && (p = it, A = ze, ge = A - p + 1), Pe = Ae.sort(
    (xe, je) => typeof xe == "number" && typeof je == "number" ? xe - je : typeof xe == "number" ? 1 : String(xe).localeCompare(String(je))
  ), $ = E ? le / Pe.length : le / ge, X.fillStyle = f, X.globalAlpha = 1, h || (X.clearRect(0, 0, O, W), X.fillRect(0, 0, O, W)), t.forEach((xe) => {
    const je = xe.whole.begin <= e && xe.endClipped > e;
    let Ct = B ?? (x && je), ut = !je && G || je && S;
    if (I && !je)
      return;
    let Ve = xe.value?.color;
    o = Ve || o, a = V && Ve || a, Ve = je ? o : a, X.fillStyle = ut ? Ve : "transparent", X.strokeStyle = Ve;
    const { velocity: cn = 1, gain: _e = 1 } = xe.value || {};
    X.globalAlpha = cn * _e;
    const Kt = (xe.whole.begin - (i ? be : ee)) / Ie, Vt = Tr(Kt, ...ie);
    let Nt = Tr(xe.duration / Ie, 0, pe);
    const ln = oo(xe), Wn = E ? Pe.indexOf(ln) / Pe.length : (Number(ln) - p) / ge, Ht = Tr(Wn, ...oe);
    let fn = 0;
    const Jt = Tr(e / Ie, ...ie);
    let yt;
    if (k ? yt = [
      Ht + 1 - (s ? $ : 0),
      // x
      pe - Jt + Vt + fn + 1 - (i ? 0 : Nt),
      // y
      $ - 2,
      // width
      Nt - 2
      // height
    ] : yt = [
      Vt - Jt + fn + 1 - (i ? Nt : 0),
      // x
      Ht + 1 - (s ? 0 : $),
      // y
      Nt - 2,
      // widith
      $ - 2
      // height
    ], Ct && X.strokeRect(...yt), ut && X.fillRect(...yt), _) {
      const En = xe.value.note ?? xe.value.s + (xe.value.n ? `:${xe.value.n}` : ""), { label: ye, activeLabel: Ze } = xe.value, We = (je && Ze || ye) ?? En;
      let ke = k ? Nt : $ * 0.75;
      X.font = `${ke}px ${q || "monospace"}`, X.fillStyle = /* isActive &&  */
      ut ? "black" : Ve, X.textBaseline = "top", X.fillText(We, ...yt);
    }
  }), X.globalAlpha = 1;
  const qe = Tr(-ee / Ie, ...ie);
  return X.strokeStyle = m, X.beginPath(), k ? (X.moveTo(0, qe), X.lineTo(le, qe)) : (X.moveTo(qe, 0), X.lineTo(qe, le)), X.stroke(), this;
}
function zC(e, t = {}) {
  let [n, r] = e;
  n = Math.abs(n);
  const i = r + n, s = i !== 0 ? n / i : 0;
  return { fold: 1, ...t, cycles: i, playhead: s };
}
const jC = (e = {}) => (t, n, r, i) => kd({ ctx: t, time: n, haps: r, ...zC(i, e) });
z.prototype.punchcard = function(e) {
  return this.onPaint(jC(e));
};
z.prototype.wordfall = function(e) {
  return this.punchcard({ vertical: 1, labels: 1, stroke: 0, fillActive: 1, active: "white", ...e });
};
function $C(e, t, n, r) {
  const i = (e - 90) * Math.PI / 180;
  return [n + Math.cos(i) * t, r + Math.sin(i) * t];
}
const co = (e, t, n, r, i = 0) => $C((e + i) * 360, t * e, n, r);
function lo(e) {
  let {
    ctx: t,
    from: n = 0,
    to: r = 3,
    margin: i = 50,
    cx: s = 100,
    cy: u = 100,
    rotate: a = 0,
    thickness: o = i / 2,
    color: f = Cn().foreground,
    cap: h = "round",
    stretch: m = 1,
    fromOpacity: p = 1,
    toOpacity: A = 1
  } = e;
  n *= m, r *= m, a *= m, t.lineWidth = o, t.lineCap = h, t.strokeStyle = f, t.globalAlpha = p, t.beginPath();
  let [M, v] = co(n, i, s, u, a);
  t.moveTo(M, v);
  const E = 1 / 60;
  let k = n;
  for (; k <= r; ) {
    const [_, G] = co(k, i, s, u, a);
    t.globalAlpha = (k - n) / (r - n) * A, t.lineTo(_, G), k += E;
  }
  t.stroke();
}
function qC(e) {
  let {
    stretch: t = 1,
    size: n = 80,
    thickness: r = n / 2,
    cap: i = "butt",
    // round butt squar,
    inset: s = 3,
    // start angl,
    playheadColor: u = "#ffffff",
    playheadLength: a = 0.02,
    playheadThickness: o = r,
    padding: f = 0,
    steady: h = 1,
    activeColor: m = Cn().foreground,
    inactiveColor: p = Cn().gutterForeground,
    colorizeInactive: A = 0,
    fade: M = !0,
    // logSpiral = true,
    ctx: v,
    time: E,
    haps: k,
    drawTime: _,
    id: G
  } = e;
  G && (k = k.filter((O) => O.hasTag(G)));
  const [S, x] = [v.canvas.width, v.canvas.height];
  v.clearRect(0, 0, S * 2, x * 2);
  const [B, I] = [S / 2, x / 2], V = {
    margin: n / t,
    cx: B,
    cy: I,
    stretch: t,
    cap: i,
    thickness: r
  }, q = {
    ...V,
    thickness: o,
    from: s - a,
    to: s,
    color: u
  }, [X] = _, U = h * E;
  k.forEach((O) => {
    const W = O.whole.begin <= E && O.endClipped > E, ee = O.whole.begin - E + s, be = O.endClipped - E + s - f, pe = O.value?.color || m, le = A || W ? pe : p, ie = M ? 1 - Math.abs((O.whole.begin - E) / X) : 1;
    lo({
      ctx: v,
      ...V,
      from: ee,
      to: be,
      rotate: U,
      color: le,
      fromOpacity: ie,
      toOpacity: ie
    });
  }), lo({
    ctx: v,
    ...q,
    rotate: U
  });
}
z.prototype.spiral = function(e = {}) {
  return this.onPaint((t, n, r, i) => qC({ ctx: t, time: n, haps: r, drawTime: i, ...e }));
};
const KC = Hn(36), fo = (e, t, n, r) => {
  r = r * Math.PI * 2;
  const i = Math.sin(r) * n + e, s = Math.cos(r) * n + t;
  return [i, s];
}, ho = (e, t) => 0.5 - Math.log2(e / t) % 1;
function HC({
  haps: e,
  ctx: t,
  id: n,
  hapcircles: r = 1,
  circle: i = 0,
  edo: s = 12,
  root: u = KC,
  thickness: a = 3,
  hapRadius: o = 6,
  mode: f = "flake",
  margin: h = 10
} = {}) {
  const m = f === "polygon", p = f === "flake", A = t.canvas.width, M = t.canvas.height;
  t.clearRect(0, 0, A, M);
  const v = Cn().foreground, k = Math.min(A, M) / 2 - a / 2 - o - h, _ = A / 2, G = M / 2;
  n && (e = e.filter((x) => x.hasTag(n))), t.strokeStyle = v, t.fillStyle = v, t.globalAlpha = 1, t.lineWidth = a, i && (t.beginPath(), t.arc(_, G, k, 0, 2 * Math.PI), t.stroke()), s && (Array.from({ length: s }, (x, B) => {
    const I = ho(u * Math.pow(2, B / s), u), [V, q] = fo(_, G, k, I);
    t.beginPath(), t.arc(V, q, o, 0, 2 * Math.PI), t.fill();
  }), t.stroke());
  let S = [];
  t.lineWidth = o, e.forEach((x) => {
    let B;
    try {
      B = mc(x);
    } catch {
      return;
    }
    const I = ho(B, u), [V, q] = fo(_, G, k, I), X = x.value.color || v;
    t.strokeStyle = X, t.fillStyle = X;
    const { velocity: U = 1, gain: O = 1 } = x.value || {}, W = U * O;
    t.globalAlpha = W, S.push([V, q, I, X, W]), t.beginPath(), r && (t.moveTo(V + o, q), t.arc(V, q, o, 0, 2 * Math.PI), t.fill()), p && (t.moveTo(_, G), t.lineTo(V, q)), t.stroke();
  }), t.strokeStyle = v, t.globalAlpha = 1, m && S.length && (S = S.sort((x, B) => x[2] - B[2]), t.beginPath(), t.moveTo(S[0][0], S[0][1]), S.forEach(([x, B, I, V, q]) => {
    t.strokeStyle = V, t.globalAlpha = q, t.lineTo(x, B);
  }), t.lineTo(S[0][0], S[0][1]), t.stroke());
}
z.prototype.pitchwheel = function(e = {}) {
  let { ctx: t = Qn(), id: n = 1 } = e;
  return this.tag(n).onPaint(
    (r, i, s) => HC({
      ...e,
      time: i,
      ctx: t,
      haps: s.filter((u) => u.isActive(i)),
      id: n
    })
  );
};
function Id(e, {
  align: t = !0,
  color: n = "white",
  thickness: r = 3,
  scale: i = 0.25,
  pos: s = 0.75,
  trigger: u = 0,
  ctx: a = Qn(),
  id: o = 1
} = {}) {
  a.lineWidth = r, a.strokeStyle = n;
  let f = a.canvas;
  if (!e) {
    a.beginPath();
    let v = s * f.height;
    a.moveTo(0, v), a.lineTo(f.width, v), a.stroke();
    return;
  }
  const h = Ki("time", o);
  a.beginPath();
  const m = e.frequencyBinCount;
  let p = t ? Array.from(h).findIndex((v, E, k) => E && k[E - 1] > -u && v <= -u) : 0;
  p = Math.max(p, 0);
  const A = f.width * 1 / m;
  let M = 0;
  for (let v = p; v < m; v++) {
    const E = h[v] + 1, k = (s - i * (E - 1)) * f.height;
    v === 0 ? a.moveTo(M, k) : a.lineTo(M, k), M += A;
  }
  a.stroke();
}
function Vd(e, { color: t = "white", scale: n = 0.25, pos: r = 0.75, lean: i = 0.5, min: s = -150, max: u = 0, ctx: a = Qn(), id: o = 1 } = {}) {
  if (!e) {
    a.beginPath();
    let M = r * h.height;
    a.moveTo(0, M), a.lineTo(h.width, M), a.stroke();
    return;
  }
  const f = Ki("frequency", o), h = a.canvas;
  a.fillStyle = t;
  const m = e.frequencyBinCount, p = h.width * 1 / m;
  let A = 0;
  for (let M = 0; M < m; M++) {
    const E = Zi((f[M] - s) / (u - s), 0, 1) * n, k = E * h.height, _ = (r - E * i) * h.height;
    a.fillRect(A, _, Math.max(p, 1), k), A += p;
  }
}
function Nd(e = 0, t = "0,0,0", n = Qn()) {
  e ? (n.fillStyle = `rgba(${t},${1 - e})`, n.fillRect(0, 0, n.canvas.width, n.canvas.height)) : n.clearRect(0, 0, n.canvas.width, n.canvas.height);
}
z.prototype.fscope = function(e = {}) {
  let t = e.id ?? 1;
  return this.analyze(t).draw(
    () => {
      Nd(e.smear, "0,0,0", e.ctx), at[t] && Vd(at[t], e);
    },
    { id: t }
  );
};
z.prototype.tscope = function(e = {}) {
  let t = e.id ?? 1;
  return this.analyze(t).draw(
    (n) => {
      e.color = n[0]?.value?.color || Cn().foreground, e.color, Nd(e.smear, "0,0,0", e.ctx), Id(at[t], e);
    },
    { id: t }
  );
};
z.prototype.scope = z.prototype.tscope;
let po = {};
z.prototype.spectrum = function(e = {}) {
  let t = e.id ?? 1;
  return this.analyze(t).draw(
    (n) => {
      e.color = n[0]?.value?.color || po[t] || Cn().foreground, po[t] = e.color, JC(at[t], e);
    },
    { id: t }
  );
};
z.prototype.scope = z.prototype.tscope;
const ws = /* @__PURE__ */ new Map();
function JC(e, { thickness: t = 3, speed: n = 1, min: r = -80, max: i = 0, ctx: s = Qn(), id: u = 1, color: a } = {}) {
  if (s.lineWidth = t, s.strokeStyle = a, !e)
    return;
  const o = n, f = Ki("frequency", u), h = s.canvas;
  s.fillStyle = a;
  const m = e.frequencyBinCount;
  let p = ws.get(u) || s.getImageData(0, 0, h.width, h.height);
  ws.set(u, p), s.clearRect(0, 0, s.canvas.width, s.canvas.height), s.putImageData(p, -o, 0);
  let A = h.width - n;
  for (let M = 0; M < m; M++) {
    const v = Zi((f[M] - r) / (i - r), 0, 1);
    s.globalAlpha = v;
    const E = Math.log(M + 1) / Math.log(m) * h.height;
    s.fillRect(A, h.height - E, o, 2);
  }
  ws.set(u, s.getImageData(0, 0, h.width, h.height));
}
const YC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DEFAULT_MAX_POLYPHONY: Yu,
  aliasBank: MC,
  get analysers() {
    return at;
  },
  get analysersData() {
    return jn;
  },
  applyFM: ki,
  applyGainCurve: On,
  connectToDestination: qi,
  createFilter: Ci,
  dough: GC,
  doughTrigger: Fd,
  drawFrequencyScope: Vd,
  drawTimeScope: Id,
  drywet: Kp,
  dspWorklet: Pd,
  gainNode: Qt,
  getADSRValues: tn,
  getAnalyserById: yd,
  getAnalyzerData: Ki,
  getAudioContext: Ee,
  getAudioContextCurrentTime: DC,
  getAudioDevices: ld,
  getCachedBuffer: pC,
  getCompressor: qp,
  getDefaultValue: Ke,
  getLfo: ea,
  getLoadedBuffer: mC,
  getOscillator: Cd,
  getParamADSR: en,
  getPitchEnvelope: Yr,
  getSampleBuffer: Jp,
  getSampleBufferSource: Yp,
  getSampleInfo: Hp,
  getSound: Pi,
  getVibratoOscillator: Ur,
  getWorklet: Wt,
  getZZFX: vd,
  initAudio: dd,
  initAudioOnFirstClick: md,
  initializeAudioOutput: gd,
  loadBuffer: Ju,
  logger: xt,
  onTriggerSample: id,
  panic: EC,
  processSampleMap: td,
  registerSamplesPrefix: gC,
  registerSound: In,
  registerSynthSounds: Ad,
  registerZZFXSounds: RC,
  resetDefaultValues: hd,
  resetGlobalEffects: _C,
  resetLoadedSounds: PC,
  reverseBuffer: Up,
  samples: rd,
  setDefaultAudioContext: pd,
  setDefaultValue: Qu,
  setDefaultValues: CC,
  setGainCurve: bC,
  setLogger: zp,
  setMaxPolyphony: ud,
  setMultiChannelOrbits: od,
  setVersionDefaults: vC,
  soundMap: dr,
  superdough: Hi,
  superdoughTrigger: kC,
  waveformN: Md,
  webAudioTimeout: vi,
  webaudioOutput: Sd,
  webaudioOutputTrigger: wd,
  webaudioRepl: Bd
}, Symbol.toStringTag, { value: "Module" }));
function UC(e, t) {
  function n() {
    this.constructor = e;
  }
  n.prototype = t.prototype, e.prototype = new n();
}
function Jn(e, t, n, r) {
  var i = Error.call(this, e);
  return Object.setPrototypeOf && Object.setPrototypeOf(i, Jn.prototype), i.expected = t, i.found = n, i.location = r, i.name = "SyntaxError", i;
}
UC(Jn, Error);
function Ss(e, t, n) {
  return n = n || " ", e.length > t ? e : (t -= e.length, n += n.repeat(t), e + n.slice(0, t));
}
Jn.prototype.format = function(e) {
  var t = "Error: " + this.message;
  if (this.location) {
    var n = null, r;
    for (r = 0; r < e.length; r++)
      if (e[r].source === this.location.source) {
        n = e[r].text.split(/\r\n|\n|\r/g);
        break;
      }
    var i = this.location.start, s = this.location.source && typeof this.location.source.offset == "function" ? this.location.source.offset(i) : i, u = this.location.source + ":" + s.line + ":" + s.column;
    if (n) {
      var a = this.location.end, o = Ss("", s.line.toString().length, " "), f = n[i.line - 1], h = i.line === a.line ? a.column : f.length + 1, m = h - i.column || 1;
      t += `
 --> ` + u + `
` + o + ` |
` + s.line + " | " + f + `
` + o + " | " + Ss("", i.column - 1, " ") + Ss("", m, "^");
    } else
      t += `
 at ` + u;
  }
  return t;
};
Jn.buildMessage = function(e, t) {
  var n = {
    literal: function(f) {
      return '"' + i(f.text) + '"';
    },
    class: function(f) {
      var h = f.parts.map(function(m) {
        return Array.isArray(m) ? s(m[0]) + "-" + s(m[1]) : s(m);
      });
      return "[" + (f.inverted ? "^" : "") + h.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(f) {
      return f.description;
    }
  };
  function r(f) {
    return f.charCodeAt(0).toString(16).toUpperCase();
  }
  function i(f) {
    return f.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(h) {
      return "\\x0" + r(h);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(h) {
      return "\\x" + r(h);
    });
  }
  function s(f) {
    return f.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(h) {
      return "\\x0" + r(h);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(h) {
      return "\\x" + r(h);
    });
  }
  function u(f) {
    return n[f.type](f);
  }
  function a(f) {
    var h = f.map(u), m, p;
    if (h.sort(), h.length > 0) {
      for (m = 1, p = 1; m < h.length; m++)
        h[m - 1] !== h[m] && (h[p] = h[m], p++);
      h.length = p;
    }
    switch (h.length) {
      case 1:
        return h[0];
      case 2:
        return h[0] + " or " + h[1];
      default:
        return h.slice(0, -1).join(", ") + ", or " + h[h.length - 1];
    }
  }
  function o(f) {
    return f ? '"' + i(f) + '"' : "end of input";
  }
  return "Expected " + a(e) + " but " + o(t) + " found.";
};
function Td(e, t) {
  t = t !== void 0 ? t : {};
  var n = {}, r = t.grammarSource, i = { start: Wa }, s = Wa, u = ".", a = "-", o = "0", f = ",", h = "|", m = "[", p = "]", A = "{", M = "}", v = "%", E = "<", k = ">", _ = "!", G = "(", S = ")", x = "/", B = "*", I = "?", V = ":", q = "..", X = "^", U = "struct", O = "target", W = "euclid", ee = "slow", be = "rotL", pe = "rotR", le = "fast", ie = "scale", Ie = "//", oe = "cat", ge = "$", $ = "setcps", Pe = "setbpm", it = "hush", ze = /^[1-9]/, Ae = /^[eE]/, qe = /^[+\-]/, xe = /^[0-9]/, je = /^[ \n\r\t\xA0]/, Ct = /^["']/, ut = /^[#\--.0-9A-Z\^-_a-z~\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376-\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u09FC\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60-\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E46\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5-\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7B9\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD-\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/, Ve = /^[@_]/, cn = /^[^\n]/, _e = bs("number"), Kt = De(".", !1), Vt = mn([["1", "9"]], !1, !1), Nt = mn(["e", "E"], !1, !1), ln = mn(["+", "-"], !1, !1), Wn = De("-", !1), Ht = De("0", !1), fn = mn([["0", "9"]], !1, !1), Jt = bs("whitespace"), yt = mn([" ", `
`, "\r", "	", " "], !1, !1), En = De(",", !1), ye = De("|", !1), Ze = mn(['"', "'"], !1, !1), ue = bs('a letter, a number, "-", "#", ".", "^", "_"'), We = mn(["#", ["-", "."], ["0", "9"], ["A", "Z"], ["^", "_"], ["a", "z"], "~", "ª", "µ", "º", ["À", "Ö"], ["Ø", "ö"], ["ø", "ˁ"], ["ˆ", "ˑ"], ["ˠ", "ˤ"], "ˬ", "ˮ", ["Ͱ", "ʹ"], ["Ͷ", "ͷ"], ["ͺ", "ͽ"], "Ϳ", "Ά", ["Έ", "Ί"], "Ό", ["Ύ", "Ρ"], ["Σ", "ϵ"], ["Ϸ", "ҁ"], ["Ҋ", "ԯ"], ["Ա", "Ֆ"], "ՙ", ["ՠ", "ֈ"], ["א", "ת"], ["ׯ", "ײ"], ["ؠ", "ي"], ["ٮ", "ٯ"], ["ٱ", "ۓ"], "ە", ["ۥ", "ۦ"], ["ۮ", "ۯ"], ["ۺ", "ۼ"], "ۿ", "ܐ", ["ܒ", "ܯ"], ["ݍ", "ޥ"], "ޱ", ["ߊ", "ߪ"], ["ߴ", "ߵ"], "ߺ", ["ࠀ", "ࠕ"], "ࠚ", "ࠤ", "ࠨ", ["ࡀ", "ࡘ"], ["ࡠ", "ࡪ"], ["ࢠ", "ࢴ"], ["ࢶ", "ࢽ"], ["ऄ", "ह"], "ऽ", "ॐ", ["क़", "ॡ"], ["ॱ", "ঀ"], ["অ", "ঌ"], ["এ", "ঐ"], ["ও", "ন"], ["প", "র"], "ল", ["শ", "হ"], "ঽ", "ৎ", ["ড়", "ঢ়"], ["য়", "ৡ"], ["ৰ", "ৱ"], "ৼ", ["ਅ", "ਊ"], ["ਏ", "ਐ"], ["ਓ", "ਨ"], ["ਪ", "ਰ"], ["ਲ", "ਲ਼"], ["ਵ", "ਸ਼"], ["ਸ", "ਹ"], ["ਖ਼", "ੜ"], "ਫ਼", ["ੲ", "ੴ"], ["અ", "ઍ"], ["એ", "ઑ"], ["ઓ", "ન"], ["પ", "ર"], ["લ", "ળ"], ["વ", "હ"], "ઽ", "ૐ", ["ૠ", "ૡ"], "ૹ", ["ଅ", "ଌ"], ["ଏ", "ଐ"], ["ଓ", "ନ"], ["ପ", "ର"], ["ଲ", "ଳ"], ["ଵ", "ହ"], "ଽ", ["ଡ଼", "ଢ଼"], ["ୟ", "ୡ"], "ୱ", "ஃ", ["அ", "ஊ"], ["எ", "ஐ"], ["ஒ", "க"], ["ங", "ச"], "ஜ", ["ஞ", "ட"], ["ண", "த"], ["ந", "ப"], ["ம", "ஹ"], "ௐ", ["అ", "ఌ"], ["ఎ", "ఐ"], ["ఒ", "న"], ["ప", "హ"], "ఽ", ["ౘ", "ౚ"], ["ౠ", "ౡ"], "ಀ", ["ಅ", "ಌ"], ["ಎ", "ಐ"], ["ಒ", "ನ"], ["ಪ", "ಳ"], ["ವ", "ಹ"], "ಽ", "ೞ", ["ೠ", "ೡ"], ["ೱ", "ೲ"], ["അ", "ഌ"], ["എ", "ഐ"], ["ഒ", "ഺ"], "ഽ", "ൎ", ["ൔ", "ൖ"], ["ൟ", "ൡ"], ["ൺ", "ൿ"], ["අ", "ඖ"], ["ක", "න"], ["ඳ", "ර"], "ල", ["ව", "ෆ"], ["ก", "ะ"], ["า", "ำ"], ["เ", "ๆ"], ["ກ", "ຂ"], "ຄ", ["ງ", "ຈ"], "ຊ", "ຍ", ["ດ", "ທ"], ["ນ", "ຟ"], ["ມ", "ຣ"], "ລ", "ວ", ["ສ", "ຫ"], ["ອ", "ະ"], ["າ", "ຳ"], "ຽ", ["ເ", "ໄ"], "ໆ", ["ໜ", "ໟ"], "ༀ", ["ཀ", "ཇ"], ["ཉ", "ཬ"], ["ྈ", "ྌ"], ["က", "ဪ"], "ဿ", ["ၐ", "ၕ"], ["ၚ", "ၝ"], "ၡ", ["ၥ", "ၦ"], ["ၮ", "ၰ"], ["ၵ", "ႁ"], "ႎ", ["Ⴀ", "Ⴥ"], "Ⴧ", "Ⴭ", ["ა", "ჺ"], ["ჼ", "ቈ"], ["ቊ", "ቍ"], ["ቐ", "ቖ"], "ቘ", ["ቚ", "ቝ"], ["በ", "ኈ"], ["ኊ", "ኍ"], ["ነ", "ኰ"], ["ኲ", "ኵ"], ["ኸ", "ኾ"], "ዀ", ["ዂ", "ዅ"], ["ወ", "ዖ"], ["ዘ", "ጐ"], ["ጒ", "ጕ"], ["ጘ", "ፚ"], ["ᎀ", "ᎏ"], ["Ꭰ", "Ᏽ"], ["ᏸ", "ᏽ"], ["ᐁ", "ᙬ"], ["ᙯ", "ᙿ"], ["ᚁ", "ᚚ"], ["ᚠ", "ᛪ"], ["ᛮ", "ᛸ"], ["ᜀ", "ᜌ"], ["ᜎ", "ᜑ"], ["ᜠ", "ᜱ"], ["ᝀ", "ᝑ"], ["ᝠ", "ᝬ"], ["ᝮ", "ᝰ"], ["ក", "ឳ"], "ៗ", "ៜ", ["ᠠ", "ᡸ"], ["ᢀ", "ᢄ"], ["ᢇ", "ᢨ"], "ᢪ", ["ᢰ", "ᣵ"], ["ᤀ", "ᤞ"], ["ᥐ", "ᥭ"], ["ᥰ", "ᥴ"], ["ᦀ", "ᦫ"], ["ᦰ", "ᧉ"], ["ᨀ", "ᨖ"], ["ᨠ", "ᩔ"], "ᪧ", ["ᬅ", "ᬳ"], ["ᭅ", "ᭋ"], ["ᮃ", "ᮠ"], ["ᮮ", "ᮯ"], ["ᮺ", "ᯥ"], ["ᰀ", "ᰣ"], ["ᱍ", "ᱏ"], ["ᱚ", "ᱽ"], ["ᲀ", "ᲈ"], ["Ა", "Ჺ"], ["Ჽ", "Ჿ"], ["ᳩ", "ᳬ"], ["ᳮ", "ᳱ"], ["ᳵ", "ᳶ"], ["ᴀ", "ᶿ"], ["Ḁ", "ἕ"], ["Ἐ", "Ἕ"], ["ἠ", "ὅ"], ["Ὀ", "Ὅ"], ["ὐ", "ὗ"], "Ὑ", "Ὓ", "Ὕ", ["Ὗ", "ώ"], ["ᾀ", "ᾴ"], ["ᾶ", "ᾼ"], "ι", ["ῂ", "ῄ"], ["ῆ", "ῌ"], ["ῐ", "ΐ"], ["ῖ", "Ί"], ["ῠ", "Ῥ"], ["ῲ", "ῴ"], ["ῶ", "ῼ"], "ⁱ", "ⁿ", ["ₐ", "ₜ"], "ℂ", "ℇ", ["ℊ", "ℓ"], "ℕ", ["ℙ", "ℝ"], "ℤ", "Ω", "ℨ", ["K", "ℭ"], ["ℯ", "ℹ"], ["ℼ", "ℿ"], ["ⅅ", "ⅉ"], "ⅎ", ["Ⅰ", "ↈ"], ["Ⰰ", "Ⱞ"], ["ⰰ", "ⱞ"], ["Ⱡ", "ⳤ"], ["Ⳬ", "ⳮ"], ["Ⳳ", "ⳳ"], ["ⴀ", "ⴥ"], "ⴧ", "ⴭ", ["ⴰ", "ⵧ"], "ⵯ", ["ⶀ", "ⶖ"], ["ⶠ", "ⶦ"], ["ⶨ", "ⶮ"], ["ⶰ", "ⶶ"], ["ⶸ", "ⶾ"], ["ⷀ", "ⷆ"], ["ⷈ", "ⷎ"], ["ⷐ", "ⷖ"], ["ⷘ", "ⷞ"], "ⸯ", ["々", "〇"], ["〡", "〩"], ["〱", "〵"], ["〸", "〼"], ["ぁ", "ゖ"], ["ゝ", "ゟ"], ["ァ", "ヺ"], ["ー", "ヿ"], ["ㄅ", "ㄯ"], ["ㄱ", "ㆎ"], ["ㆠ", "ㆺ"], ["ㇰ", "ㇿ"], ["㐀", "䶵"], ["一", "鿯"], ["ꀀ", "ꒌ"], ["ꓐ", "ꓽ"], ["ꔀ", "ꘌ"], ["ꘐ", "ꘟ"], ["ꘪ", "ꘫ"], ["Ꙁ", "ꙮ"], ["ꙿ", "ꚝ"], ["ꚠ", "ꛯ"], ["ꜗ", "ꜟ"], ["Ꜣ", "ꞈ"], ["Ꞌ", "ꞹ"], ["ꟷ", "ꠁ"], ["ꠃ", "ꠅ"], ["ꠇ", "ꠊ"], ["ꠌ", "ꠢ"], ["ꡀ", "ꡳ"], ["ꢂ", "ꢳ"], ["ꣲ", "ꣷ"], "ꣻ", ["ꣽ", "ꣾ"], ["ꤊ", "ꤥ"], ["ꤰ", "ꥆ"], ["ꥠ", "ꥼ"], ["ꦄ", "ꦲ"], "ꧏ", ["ꧠ", "ꧤ"], ["ꧦ", "ꧯ"], ["ꧺ", "ꧾ"], ["ꨀ", "ꨨ"], ["ꩀ", "ꩂ"], ["ꩄ", "ꩋ"], ["ꩠ", "ꩶ"], "ꩺ", ["ꩾ", "ꪯ"], "ꪱ", ["ꪵ", "ꪶ"], ["ꪹ", "ꪽ"], "ꫀ", "ꫂ", ["ꫛ", "ꫝ"], ["ꫠ", "ꫪ"], ["ꫲ", "ꫴ"], ["ꬁ", "ꬆ"], ["ꬉ", "ꬎ"], ["ꬑ", "ꬖ"], ["ꬠ", "ꬦ"], ["ꬨ", "ꬮ"], ["ꬰ", "ꭚ"], ["ꭜ", "ꭥ"], ["ꭰ", "ꯢ"], ["가", "힣"], ["ힰ", "ퟆ"], ["ퟋ", "ퟻ"], ["豈", "舘"], ["並", "龎"], ["ﬀ", "ﬆ"], ["ﬓ", "ﬗ"], "יִ", ["ײַ", "ﬨ"], ["שׁ", "זּ"], ["טּ", "לּ"], "מּ", ["נּ", "סּ"], ["ףּ", "פּ"], ["צּ", "ﮱ"], ["ﯓ", "ﴽ"], ["ﵐ", "ﶏ"], ["ﶒ", "ﷇ"], ["ﷰ", "ﷻ"], ["ﹰ", "ﹴ"], ["ﹶ", "ﻼ"], ["Ａ", "Ｚ"], ["ａ", "ｚ"], ["ｦ", "ﾾ"], ["ￂ", "ￇ"], ["ￊ", "ￏ"], ["ￒ", "ￗ"], ["ￚ", "ￜ"]], !1, !1), ke = De("[", !1), xn = De("]", !1), _r = De("{", !1), ct = De("}", !1), Tt = De("%", !1), bt = De("<", !1), fe = De(">", !1), hn = mn(["@", "_"], !1, !1), pn = De("!", !1), Ne = De("(", !1), Qe = De(")", !1), Yt = De("/", !1), Me = De("*", !1), vt = De("?", !1), lt = De(":", !1), ft = De("..", !1), c = De("^", !1), g = De("struct", !1), d = De("target", !1), y = De("euclid", !1), P = De("slow", !1), N = De("rotL", !1), R = De("rotR", !1), Z = De("fast", !1), J = De("scale", !1), Ce = De("//", !1), Oe = mn([`
`], !0, !1), dn = De("cat", !1), wn = De("$", !1), ci = De("setcps", !1), li = De("setbpm", !1), Pt = De("hush", !1), Gg = function() {
    return parseFloat(D2());
  }, Xg = function(l) {
    const C = l.join("");
    return C === "." || C === "_";
  }, Zg = function(l) {
    return new py(l.join(""));
  }, Wg = function(l) {
    return l;
  }, Og = function(l, C) {
    return l.arguments_.stepsPerCycle = C, l;
  }, zg = function(l) {
    return l;
  }, jg = function(l) {
    return l.arguments_.alignment = "polymeter_slowcat", l;
  }, $g = function(l) {
    return (C) => C.options_.weight = (C.options_.weight ?? 1) + (l ?? 2) - 1;
  }, qg = function(l) {
    return (C) => {
      const F = (C.options_.reps ?? 1) + (l ?? 2) - 1;
      C.options_.reps = F, C.options_.ops = C.options_.ops.filter((L) => L.type_ !== "replicate"), C.options_.ops.push({ type_: "replicate", arguments_: { amount: F } }), C.options_.weight = F;
    };
  }, Kg = function(l, C, F) {
    return (L) => L.options_.ops.push({ type_: "bjorklund", arguments_: { pulse: l, step: C, rotation: F } });
  }, Hg = function(l) {
    return (C) => C.options_.ops.push({ type_: "stretch", arguments_: { amount: l, type: "slow" } });
  }, Jg = function(l) {
    return (C) => C.options_.ops.push({ type_: "stretch", arguments_: { amount: l, type: "fast" } });
  }, Yg = function(l) {
    return (C) => C.options_.ops.push({ type_: "degradeBy", arguments_: { amount: l, seed: vs++ } });
  }, Ug = function(l) {
    return (C) => C.options_.ops.push({ type_: "tail", arguments_: { element: l } });
  }, Qg = function(l) {
    return (C) => C.options_.ops.push({ type_: "range", arguments_: { element: l } });
  }, e2 = function(l, C) {
    const F = new my(l, { ops: [], weight: 1, reps: 1 });
    for (const L of C)
      L(F);
    return F;
  }, t2 = function(l, C) {
    return new di(C, "fastcat", void 0, !!l);
  }, n2 = function(l) {
    return { alignment: "stack", list: l };
  }, r2 = function(l) {
    return { alignment: "rand", list: l, seed: vs++ };
  }, i2 = function(l) {
    return { alignment: "feet", list: l, seed: vs++ };
  }, s2 = function(l, C) {
    return C && C.list.length > 0 ? new di([l, ...C.list], C.alignment, C.seed) : l;
  }, u2 = function(l, C) {
    return new di(C ? [l, ...C.list] : [l], "polymeter");
  }, a2 = function(l) {
    return l;
  }, o2 = function(l) {
    return { name: "struct", args: { mini: l } };
  }, c2 = function(l) {
    return { name: "target", args: { name: l } };
  }, l2 = function(l, C, F) {
    return { name: "bjorklund", args: { pulse: l, step: parseInt(C) } };
  }, f2 = function(l) {
    return { name: "stretch", args: { amount: l } };
  }, h2 = function(l) {
    return { name: "shift", args: { amount: "-" + l } };
  }, p2 = function(l) {
    return { name: "shift", args: { amount: l } };
  }, d2 = function(l) {
    return { name: "stretch", args: { amount: "1/" + l } };
  }, m2 = function(l) {
    return { name: "scale", args: { scale: l.join("") } };
  }, Ga = function(l, C) {
    return C;
  }, g2 = function(l, C) {
    return C.unshift(l), new di(C, "slowcat");
  }, y2 = function(l) {
    return l;
  }, b2 = function(l, C) {
    return new dy(l.name, l.args, C);
  }, A2 = function(l) {
    return l;
  }, M2 = function(l) {
    return l;
  }, C2 = function(l) {
    return new Cs("setcps", { value: l });
  }, v2 = function(l) {
    return new Cs("setcps", { value: l / 120 / 2 });
  }, P2 = function() {
    return new Cs("hush");
  }, D = t.peg$currPos | 0, he = D, tr = [{ line: 1, column: 1 }], Lt = D, fi = t.peg$maxFailExpected || [], te = t.peg$silentFails | 0, kr;
  if (t.startRule) {
    if (!(t.startRule in i))
      throw new Error(`Can't start parsing from rule "` + t.startRule + '".');
    s = i[t.startRule];
  }
  function D2() {
    return e.substring(he, D);
  }
  function Xa() {
    return As(he, D);
  }
  function De(l, C) {
    return { type: "literal", text: l, ignoreCase: C };
  }
  function mn(l, C, F) {
    return { type: "class", parts: l, inverted: C, ignoreCase: F };
  }
  function F2() {
    return { type: "end" };
  }
  function bs(l) {
    return { type: "other", description: l };
  }
  function Za(l) {
    var C = tr[l], F;
    if (C)
      return C;
    if (l >= tr.length)
      F = tr.length - 1;
    else
      for (F = l; !tr[--F]; )
        ;
    for (C = tr[F], C = {
      line: C.line,
      column: C.column
    }; F < l; )
      e.charCodeAt(F) === 10 ? (C.line++, C.column = 1) : C.column++, F++;
    return tr[l] = C, C;
  }
  function As(l, C, F) {
    var L = Za(l), ne = Za(C), Re = {
      source: r,
      start: {
        offset: l,
        line: L.line,
        column: L.column
      },
      end: {
        offset: C,
        line: ne.line,
        column: ne.column
      }
    };
    return Re;
  }
  function se(l) {
    D < Lt || (D > Lt && (Lt = D, fi = []), fi.push(l));
  }
  function E2(l, C, F) {
    return new Jn(
      Jn.buildMessage(l, C),
      l,
      C,
      F
    );
  }
  function Wa() {
    var l;
    return l = hy(), l;
  }
  function gn() {
    var l, C;
    return te++, l = D, k2(), C = hi(), C !== n ? (_2(), B2(), he = l, l = Gg()) : (D = l, l = n), te--, l === n && te === 0 && se(_e), l;
  }
  function x2() {
    var l;
    return e.charCodeAt(D) === 46 ? (l = u, D++) : (l = n, te === 0 && se(Kt)), l;
  }
  function w2() {
    var l;
    return l = e.charAt(D), ze.test(l) ? D++ : (l = n, te === 0 && se(Vt)), l;
  }
  function S2() {
    var l;
    return l = e.charAt(D), Ae.test(l) ? D++ : (l = n, te === 0 && se(Nt)), l;
  }
  function B2() {
    var l, C, F, L, ne;
    if (l = D, C = S2(), C !== n) {
      if (F = e.charAt(D), qe.test(F) ? D++ : (F = n, te === 0 && se(ln)), F === n && (F = null), L = [], ne = nr(), ne !== n)
        for (; ne !== n; )
          L.push(ne), ne = nr();
      else
        L = n;
      L !== n ? (C = [C, F, L], l = C) : (D = l, l = n);
    } else
      D = l, l = n;
    return l;
  }
  function _2() {
    var l, C, F, L;
    if (l = D, C = x2(), C !== n) {
      if (F = [], L = nr(), L !== n)
        for (; L !== n; )
          F.push(L), L = nr();
      else
        F = n;
      F !== n ? (C = [C, F], l = C) : (D = l, l = n);
    } else
      D = l, l = n;
    return l;
  }
  function hi() {
    var l, C, F, L;
    if (l = I2(), l === n)
      if (l = D, C = w2(), C !== n) {
        for (F = [], L = nr(); L !== n; )
          F.push(L), L = nr();
        C = [C, F], l = C;
      } else
        D = l, l = n;
    return l;
  }
  function k2() {
    var l;
    return e.charCodeAt(D) === 45 ? (l = a, D++) : (l = n, te === 0 && se(Wn)), l;
  }
  function I2() {
    var l;
    return e.charCodeAt(D) === 48 ? (l = o, D++) : (l = n, te === 0 && se(Ht)), l;
  }
  function nr() {
    var l;
    return l = e.charAt(D), xe.test(l) ? D++ : (l = n, te === 0 && se(fn)), l;
  }
  function ae() {
    var l, C;
    for (te++, l = [], C = e.charAt(D), je.test(C) ? D++ : (C = n, te === 0 && se(yt)); C !== n; )
      l.push(C), C = e.charAt(D), je.test(C) ? D++ : (C = n, te === 0 && se(yt));
    return te--, C = n, te === 0 && se(Jt), l;
  }
  function rr() {
    var l, C, F, L;
    return l = D, C = ae(), e.charCodeAt(D) === 44 ? (F = f, D++) : (F = n, te === 0 && se(En)), F !== n ? (L = ae(), C = [C, F, L], l = C) : (D = l, l = n), l;
  }
  function Oa() {
    var l, C, F, L;
    return l = D, C = ae(), e.charCodeAt(D) === 124 ? (F = h, D++) : (F = n, te === 0 && se(ye)), F !== n ? (L = ae(), C = [C, F, L], l = C) : (D = l, l = n), l;
  }
  function za() {
    var l, C, F, L;
    return l = D, C = ae(), e.charCodeAt(D) === 46 ? (F = u, D++) : (F = n, te === 0 && se(Kt)), F !== n ? (L = ae(), C = [C, F, L], l = C) : (D = l, l = n), l;
  }
  function ir() {
    var l;
    return l = e.charAt(D), Ct.test(l) ? D++ : (l = n, te === 0 && se(Ze)), l;
  }
  function pi() {
    var l;
    return te++, l = e.charAt(D), ut.test(l) ? D++ : (l = n, te === 0 && se(We)), te--, l === n && te === 0 && se(ue), l;
  }
  function ja() {
    var l, C, F, L;
    if (l = D, ae(), C = [], F = pi(), F !== n)
      for (; F !== n; )
        C.push(F), F = pi();
    else
      C = n;
    return C !== n ? (F = ae(), he = D, L = Xg(C), L ? L = n : L = void 0, L !== n ? (he = l, l = Zg(C)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function V2() {
    var l, C, F, L;
    return l = D, ae(), e.charCodeAt(D) === 91 ? (C = m, D++) : (C = n, te === 0 && se(ke)), C !== n ? (ae(), F = Ka(), F !== n ? (ae(), e.charCodeAt(D) === 93 ? (L = p, D++) : (L = n, te === 0 && se(xn)), L !== n ? (ae(), he = l, l = Wg(F)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function N2() {
    var l, C, F, L, ne;
    return l = D, ae(), e.charCodeAt(D) === 123 ? (C = A, D++) : (C = n, te === 0 && se(_r)), C !== n ? (ae(), F = Ha(), F !== n ? (ae(), e.charCodeAt(D) === 125 ? (L = M, D++) : (L = n, te === 0 && se(ct)), L !== n ? (ne = T2(), ne === n && (ne = null), ae(), he = l, l = Og(F, ne)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function T2() {
    var l, C, F;
    return l = D, e.charCodeAt(D) === 37 ? (C = v, D++) : (C = n, te === 0 && se(Tt)), C !== n ? (F = sr(), F !== n ? (he = l, l = zg(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function L2() {
    var l, C, F, L;
    return l = D, ae(), e.charCodeAt(D) === 60 ? (C = E, D++) : (C = n, te === 0 && se(bt)), C !== n ? (ae(), F = Ha(), F !== n ? (ae(), e.charCodeAt(D) === 62 ? (L = k, D++) : (L = n, te === 0 && se(fe)), L !== n ? (ae(), he = l, l = jg(F)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function sr() {
    var l;
    return l = ja(), l === n && (l = V2(), l === n && (l = N2(), l === n && (l = L2()))), l;
  }
  function $a() {
    var l;
    return l = R2(), l === n && (l = X2(), l === n && (l = Z2(), l === n && (l = W2(), l === n && (l = G2(), l === n && (l = O2(), l === n && (l = z2(), l === n && (l = j2()))))))), l;
  }
  function R2() {
    var l, C, F;
    return l = D, ae(), C = e.charAt(D), Ve.test(C) ? D++ : (C = n, te === 0 && se(hn)), C !== n ? (F = gn(), F === n && (F = null), he = l, l = $g(F)) : (D = l, l = n), l;
  }
  function G2() {
    var l, C, F;
    return l = D, ae(), e.charCodeAt(D) === 33 ? (C = _, D++) : (C = n, te === 0 && se(pn)), C !== n ? (F = gn(), F === n && (F = null), he = l, l = qg(F)) : (D = l, l = n), l;
  }
  function X2() {
    var l, C, F, L, ne, Re, Rt;
    return l = D, e.charCodeAt(D) === 40 ? (C = G, D++) : (C = n, te === 0 && se(Ne)), C !== n ? (ae(), F = Ir(), F !== n ? (ae(), L = rr(), L !== n ? (ae(), ne = Ir(), ne !== n ? (ae(), rr(), ae(), Re = Ir(), Re === n && (Re = null), ae(), e.charCodeAt(D) === 41 ? (Rt = S, D++) : (Rt = n, te === 0 && se(Qe)), Rt !== n ? (he = l, l = Kg(F, ne, Re)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function Z2() {
    var l, C, F;
    return l = D, e.charCodeAt(D) === 47 ? (C = x, D++) : (C = n, te === 0 && se(Yt)), C !== n ? (F = sr(), F !== n ? (he = l, l = Hg(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function W2() {
    var l, C, F;
    return l = D, e.charCodeAt(D) === 42 ? (C = B, D++) : (C = n, te === 0 && se(Me)), C !== n ? (F = sr(), F !== n ? (he = l, l = Jg(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function O2() {
    var l, C, F;
    return l = D, e.charCodeAt(D) === 63 ? (C = I, D++) : (C = n, te === 0 && se(vt)), C !== n ? (F = gn(), F === n && (F = null), he = l, l = Yg(F)) : (D = l, l = n), l;
  }
  function z2() {
    var l, C, F;
    return l = D, e.charCodeAt(D) === 58 ? (C = V, D++) : (C = n, te === 0 && se(lt)), C !== n ? (F = sr(), F !== n ? (he = l, l = Ug(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function j2() {
    var l, C, F;
    return l = D, e.substr(D, 2) === q ? (C = q, D += 2) : (C = n, te === 0 && se(ft)), C !== n ? (F = sr(), F !== n ? (he = l, l = Qg(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function Ir() {
    var l, C, F, L;
    if (l = D, C = sr(), C !== n) {
      for (F = [], L = $a(); L !== n; )
        F.push(L), L = $a();
      he = l, l = e2(C, F);
    } else
      D = l, l = n;
    return l;
  }
  function Sn() {
    var l, C, F, L;
    if (l = D, e.charCodeAt(D) === 94 ? (C = X, D++) : (C = n, te === 0 && se(c)), C === n && (C = null), F = [], L = Ir(), L !== n)
      for (; L !== n; )
        F.push(L), L = Ir();
    else
      F = n;
    return F !== n ? (he = l, l = t2(C, F)) : (D = l, l = n), l;
  }
  function qa() {
    var l, C, F, L, ne;
    if (l = D, C = [], F = D, L = rr(), L !== n ? (ne = Sn(), ne !== n ? F = ne : (D = F, F = n)) : (D = F, F = n), F !== n)
      for (; F !== n; )
        C.push(F), F = D, L = rr(), L !== n ? (ne = Sn(), ne !== n ? F = ne : (D = F, F = n)) : (D = F, F = n);
    else
      C = n;
    return C !== n && (he = l, C = n2(C)), l = C, l;
  }
  function $2() {
    var l, C, F, L, ne;
    if (l = D, C = [], F = D, L = Oa(), L !== n ? (ne = Sn(), ne !== n ? F = ne : (D = F, F = n)) : (D = F, F = n), F !== n)
      for (; F !== n; )
        C.push(F), F = D, L = Oa(), L !== n ? (ne = Sn(), ne !== n ? F = ne : (D = F, F = n)) : (D = F, F = n);
    else
      C = n;
    return C !== n && (he = l, C = r2(C)), l = C, l;
  }
  function q2() {
    var l, C, F, L, ne;
    if (l = D, C = [], F = D, L = za(), L !== n ? (ne = Sn(), ne !== n ? F = ne : (D = F, F = n)) : (D = F, F = n), F !== n)
      for (; F !== n; )
        C.push(F), F = D, L = za(), L !== n ? (ne = Sn(), ne !== n ? F = ne : (D = F, F = n)) : (D = F, F = n);
    else
      C = n;
    return C !== n && (he = l, C = i2(C)), l = C, l;
  }
  function Ka() {
    var l, C, F;
    return l = D, C = Sn(), C !== n ? (F = qa(), F === n && (F = $2(), F === n && (F = q2())), F === n && (F = null), he = l, l = s2(C, F)) : (D = l, l = n), l;
  }
  function Ha() {
    var l, C, F;
    return l = D, C = Sn(), C !== n ? (F = qa(), F === n && (F = null), he = l, l = u2(C, F)) : (D = l, l = n), l;
  }
  function K2() {
    var l, C, F, L;
    return l = D, ae(), C = ir(), C !== n ? (ae(), F = Ka(), F !== n ? (ae(), L = ir(), L !== n ? (he = l, l = a2(F)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function H2() {
    var l;
    return l = ry(), l === n && (l = Q2(), l === n && (l = ny(), l === n && (l = Y2(), l === n && (l = U2(), l === n && (l = J2(), l === n && (l = ty(), l === n && (l = ey()))))))), l;
  }
  function J2() {
    var l, C, F;
    return l = D, e.substr(D, 6) === U ? (C = U, D += 6) : (C = n, te === 0 && se(g)), C !== n ? (ae(), F = ur(), F !== n ? (he = l, l = o2(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function Y2() {
    var l, C, F, L, ne;
    return l = D, e.substr(D, 6) === O ? (C = O, D += 6) : (C = n, te === 0 && se(d)), C !== n ? (ae(), F = ir(), F !== n ? (L = ja(), L !== n ? (ne = ir(), ne !== n ? (he = l, l = c2(L)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function U2() {
    var l, C, F, L;
    return l = D, e.substr(D, 6) === W ? (C = W, D += 6) : (C = n, te === 0 && se(y)), C !== n ? (ae(), F = hi(), F !== n ? (ae(), L = hi(), L !== n ? (ae(), hi(), he = l, l = l2(F, L)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function Q2() {
    var l, C, F;
    return l = D, e.substr(D, 4) === ee ? (C = ee, D += 4) : (C = n, te === 0 && se(P)), C !== n ? (ae(), F = gn(), F !== n ? (he = l, l = f2(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function ey() {
    var l, C, F;
    return l = D, e.substr(D, 4) === be ? (C = be, D += 4) : (C = n, te === 0 && se(N)), C !== n ? (ae(), F = gn(), F !== n ? (he = l, l = h2(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function ty() {
    var l, C, F;
    return l = D, e.substr(D, 4) === pe ? (C = pe, D += 4) : (C = n, te === 0 && se(R)), C !== n ? (ae(), F = gn(), F !== n ? (he = l, l = p2(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function ny() {
    var l, C, F;
    return l = D, e.substr(D, 4) === le ? (C = le, D += 4) : (C = n, te === 0 && se(Z)), C !== n ? (ae(), F = gn(), F !== n ? (he = l, l = d2(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function ry() {
    var l, C, F, L, ne;
    if (l = D, e.substr(D, 5) === ie ? (C = ie, D += 5) : (C = n, te === 0 && se(J)), C !== n)
      if (ae(), F = ir(), F !== n) {
        if (L = [], ne = pi(), ne !== n)
          for (; ne !== n; )
            L.push(ne), ne = pi();
        else
          L = n;
        L !== n ? (ne = ir(), ne !== n ? (he = l, l = m2(L)) : (D = l, l = n)) : (D = l, l = n);
      } else
        D = l, l = n;
    else
      D = l, l = n;
    return l;
  }
  function Ms() {
    var l, C, F, L;
    if (l = D, e.substr(D, 2) === Ie ? (C = Ie, D += 2) : (C = n, te === 0 && se(Ce)), C !== n) {
      for (F = [], L = e.charAt(D), cn.test(L) ? D++ : (L = n, te === 0 && se(Oe)); L !== n; )
        F.push(L), L = e.charAt(D), cn.test(L) ? D++ : (L = n, te === 0 && se(Oe));
      C = [C, F], l = C;
    } else
      D = l, l = n;
    return l;
  }
  function iy() {
    var l, C, F, L, ne, Re, Rt, ar;
    if (l = D, e.substr(D, 3) === oe ? (C = oe, D += 3) : (C = n, te === 0 && se(dn)), C !== n)
      if (ae(), e.charCodeAt(D) === 91 ? (F = m, D++) : (F = n, te === 0 && se(ke)), F !== n)
        if (ae(), L = ur(), L !== n) {
          for (ne = [], Re = D, Rt = rr(), Rt !== n ? (ar = ur(), ar !== n ? (he = Re, Re = Ga(L, ar)) : (D = Re, Re = n)) : (D = Re, Re = n); Re !== n; )
            ne.push(Re), Re = D, Rt = rr(), Rt !== n ? (ar = ur(), ar !== n ? (he = Re, Re = Ga(L, ar)) : (D = Re, Re = n)) : (D = Re, Re = n);
          Re = ae(), e.charCodeAt(D) === 93 ? (Rt = p, D++) : (Rt = n, te === 0 && se(xn)), Rt !== n ? (he = l, l = g2(L, ne)) : (D = l, l = n);
        } else
          D = l, l = n;
      else
        D = l, l = n;
    else
      D = l, l = n;
    return l;
  }
  function sy() {
    var l;
    return l = iy(), l === n && (l = K2()), l;
  }
  function ur() {
    var l, C, F, L, ne;
    if (l = D, C = sy(), C !== n) {
      for (ae(), F = [], L = Ms(); L !== n; )
        F.push(L), L = Ms();
      he = l, l = y2(C);
    } else
      D = l, l = n;
    return l === n && (l = D, C = H2(), C !== n ? (ae(), e.charCodeAt(D) === 36 ? (F = ge, D++) : (F = n, te === 0 && se(wn)), F !== n ? (L = ae(), ne = ur(), ne !== n ? (he = l, l = b2(C, ne)) : (D = l, l = n)) : (D = l, l = n)) : (D = l, l = n)), l;
  }
  function uy() {
    var l, C;
    return l = D, C = ur(), C !== n && (he = l, C = A2(C)), l = C, l === n && (l = Ms()), l;
  }
  function ay() {
    var l;
    return l = uy(), l;
  }
  function oy() {
    var l, C;
    return l = D, ae(), C = cy(), C === n && (C = ly(), C === n && (C = fy())), C !== n ? (ae(), he = l, l = M2(C)) : (D = l, l = n), l;
  }
  function cy() {
    var l, C, F;
    return l = D, e.substr(D, 6) === $ ? (C = $, D += 6) : (C = n, te === 0 && se(ci)), C !== n ? (ae(), F = gn(), F !== n ? (he = l, l = C2(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function ly() {
    var l, C, F;
    return l = D, e.substr(D, 6) === Pe ? (C = Pe, D += 6) : (C = n, te === 0 && se(li)), C !== n ? (ae(), F = gn(), F !== n ? (he = l, l = v2(F)) : (D = l, l = n)) : (D = l, l = n), l;
  }
  function fy() {
    var l, C;
    return l = D, e.substr(D, 4) === it ? (C = it, D += 4) : (C = n, te === 0 && se(Pt)), C !== n && (he = l, C = P2()), l = C, l;
  }
  function hy() {
    var l;
    return l = ay(), l === n && (l = oy()), l;
  }
  var py = function(l) {
    this.type_ = "atom", this.source_ = l, this.location_ = Xa();
  }, di = function(l, C, F, L) {
    this.type_ = "pattern", this.arguments_ = { alignment: C, _steps: L }, F !== void 0 && (this.arguments_.seed = F), this.source_ = l;
  }, dy = function(l, C, F) {
    this.type_ = l, this.arguments_ = C, this.source_ = F;
  }, my = function(l, C) {
    this.type_ = "element", this.source_ = l, this.options_ = C, this.location_ = Xa();
  }, Cs = function(l, C) {
    this.type_ = "command", this.name_ = l, this.options_ = C;
  }, vs = 0;
  if (kr = s(), t.peg$library)
    return (
      /** @type {any} */
      {
        peg$result: kr,
        peg$currPos: D,
        peg$FAILED: n,
        peg$maxFailExpected: fi,
        peg$maxFailPos: Lt
      }
    );
  if (kr !== n && D === e.length)
    return kr;
  throw kr !== n && D < e.length && se(F2()), E2(
    fi,
    Lt < e.length ? e.charAt(Lt) : null,
    Lt < e.length ? As(Lt, Lt + 1) : As(Lt, Lt)
  );
}
const QC = [
  "start"
], Ld = 3e-4, ev = (e, t) => (n, r) => {
  const u = e.source_[r].options_?.ops, a = n.__steps_source;
  if (u)
    for (const o of u)
      switch (o.type_) {
        case "stretch": {
          const f = ["fast", "slow"], { type: h, amount: m } = o.arguments_;
          if (!f.includes(h))
            throw new Error(`mini: stretch: type must be one of ${f.join("|")} but got ${h}`);
          n = K(n)[h](t(m));
          break;
        }
        case "replicate": {
          const { amount: f } = o.arguments_;
          n = K(n), n = n._repeatCycles(f)._fast(f);
          break;
        }
        case "bjorklund": {
          o.arguments_.rotation ? n = n.euclidRot(t(o.arguments_.pulse), t(o.arguments_.step), t(o.arguments_.rotation)) : n = n.euclid(t(o.arguments_.pulse), t(o.arguments_.step));
          break;
        }
        case "degradeBy": {
          n = K(n)._degradeByWith(mt.early(Ld * o.arguments_.seed), o.arguments_.amount ?? 0.5);
          break;
        }
        case "tail": {
          const f = t(o.arguments_.element);
          n = n.fmap((h) => (m) => Array.isArray(h) ? [...h, m] : [h, m]).appLeft(f);
          break;
        }
        case "range": {
          const f = t(o.arguments_.element);
          n = K(n);
          const h = (p, A, M = 1) => Array.from(
            { length: Math.abs(A - p) / M + 1 },
            (v, E) => p < A ? p + E * M : p - E * M
          );
          n = ((p, A) => p.squeezeBind((M) => A.bind((v) => gt(...h(M, v)))))(n, f);
          break;
        }
        default:
          console.warn(`operator "${o.type_}" not implemented`);
      }
  return n.__steps_source = n.__steps_source || a, n;
};
function Cr(e, t, n, r = 0) {
  n?.(e);
  const i = (s) => Cr(s, t, n, r);
  switch (e.type_) {
    case "pattern": {
      const s = e.source_.map((f) => i(f)).map(ev(e, i)), u = e.arguments_.alignment, a = s.filter((f) => f.__steps_source);
      let o;
      switch (u) {
        case "stack": {
          o = Te(...s), a.length && (o._steps = Ot(...a.map((f) => j(f._steps))));
          break;
        }
        case "polymeter_slowcat": {
          o = Te(...s.map((f) => f._slow(f.__weight))), a.length && (o._steps = Ot(...a.map((f) => j(f._steps))));
          break;
        }
        case "polymeter": {
          const f = e.arguments_.stepsPerCycle ? i(e.arguments_.stepsPerCycle).fmap((m) => j(m)) : Ye(j(s.length > 0 ? s[0].__weight : 1)), h = s.map((m) => m.fast(f.fmap((p) => p.div(m.__weight))));
          o = Te(...h);
          break;
        }
        case "rand": {
          o = $u(mt.early(Ld * e.arguments_.seed).segment(1), s), a.length && (o._steps = Ot(...a.map((f) => j(f._steps))));
          break;
        }
        case "feet": {
          o = gt(...s);
          break;
        }
        default: {
          if (e.source_.some((h) => !!h.options_?.weight)) {
            const h = e.source_.reduce(
              (m, p) => m.add(p.options_?.weight || j(1)),
              j(0)
            );
            o = Iu(
              ...e.source_.map((m, p) => [m.options_?.weight || j(1), s[p]])
            ), o.__weight = h, o._steps = h, a.length && (o._steps = o._steps.mul(Ot(...a.map((m) => j(m._steps)))));
          } else
            o = Bt(...s), o._steps = s.length;
          e.arguments_._steps && (o.__steps_source = !0);
        }
      }
      return a.length && (o.__steps_source = !0), o;
    }
    case "element":
      return i(e.source_);
    case "atom": {
      if (e.source_ === "~" || e.source_ === "-")
        return Be;
      if (!e.location_)
        return console.warn("no location for", e), e.source_;
      const s = isNaN(Number(e.source_)) ? e.source_ : Number(e.source_);
      if (r === -1)
        return Ye(s);
      const [u, a] = ta(t, e, r);
      return Ye(s).withLoc(u, a);
    }
    case "stretch":
      return i(e.source_).slow(i(e.arguments_.amount));
    default:
      return console.warn(`node type "${e.type_}" not implemented -> returning silence`), Be;
  }
}
const ta = (e, t, n = 0) => {
  const { start: r, end: i } = t.location_, s = e?.split("").slice(r.offset, i.offset).join(""), [u = 0, a = 0] = s ? s.split(t.source_).map((o) => o.split("").filter((f) => f === " ").length) : [];
  return [r.offset + u + n, i.offset - a + n];
}, ri = (e, t = 0, n = e) => {
  try {
    return Td(e);
  } catch (r) {
    const i = [r.location.start.offset + t, r.location.end.offset + t], s = n.slice(0, i[0]).split(`
`).length;
    throw new Error(`[mini] parse error at line ${s}: ${r.message}`);
  }
}, Rd = (e, t, n) => {
  const r = ri(e, t, n);
  let i = [];
  return Cr(
    r,
    e,
    (s) => {
      s.type_ === "atom" && i.push(s);
    },
    -1
  ), i;
}, na = (e, t = 0, n) => Rd(e, t, n).map((r) => ta(e, r, t)), ra = (...e) => {
  const t = e.map((n) => {
    const r = `"${n}"`, i = ri(r);
    return Cr(i, r);
  });
  return Bt(...t);
}, tv = (e, t) => {
  const n = `"${e}"`, r = ri(n);
  return Cr(r, n, null, t);
}, nv = (e) => {
  const t = ri(e);
  return Cr(t, e);
};
function rv(e) {
  return typeof e == "string" ? ra(e) : K(e);
}
function Gd() {
  wc(ra);
}
const iv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StartRules: QC,
  SyntaxError: Jn,
  getLeafLocation: ta,
  getLeafLocations: na,
  getLeaves: Rd,
  h: nv,
  m: tv,
  mini: ra,
  mini2ast: ri,
  miniAllStrings: Gd,
  minify: rv,
  parse: Td,
  patternifyAST: Cr
}, Symbol.toStringTag, { value: "Module" }));
var sv = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 80, 3, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 343, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 726, 6, 110, 6, 6, 9, 4759, 9, 787719, 239], Xd = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 2, 60, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 42, 9, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 496, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191], uv = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･", Zd = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ", Bs = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
}, _s = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", av = {
  5: _s,
  "5module": _s + " export import",
  6: _s + " const class extends export import super"
}, ov = /^in(stanceof)?$/, cv = new RegExp("[" + Zd + "]"), lv = new RegExp("[" + Zd + uv + "]");
function cu(e, t) {
  for (var n = 65536, r = 0; r < t.length; r += 2) {
    if (n += t[r], n > e)
      return !1;
    if (n += t[r + 1], n >= e)
      return !0;
  }
  return !1;
}
function vn(e, t) {
  return e < 65 ? e === 36 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && cv.test(String.fromCharCode(e)) : t === !1 ? !1 : cu(e, Xd);
}
function mr(e, t) {
  return e < 48 ? e === 36 : e < 58 ? !0 : e < 65 ? !1 : e < 91 ? !0 : e < 97 ? e === 95 : e < 123 ? !0 : e <= 65535 ? e >= 170 && lv.test(String.fromCharCode(e)) : t === !1 ? !1 : cu(e, Xd) || cu(e, sv);
}
var we = function(t, n) {
  n === void 0 && (n = {}), this.label = t, this.keyword = n.keyword, this.beforeExpr = !!n.beforeExpr, this.startsExpr = !!n.startsExpr, this.isLoop = !!n.isLoop, this.isAssign = !!n.isAssign, this.prefix = !!n.prefix, this.postfix = !!n.postfix, this.binop = n.binop || null, this.updateContext = null;
};
function Dt(e, t) {
  return new we(e, { beforeExpr: !0, binop: t });
}
var Ft = { beforeExpr: !0 }, ht = { startsExpr: !0 }, ia = {};
function Fe(e, t) {
  return t === void 0 && (t = {}), t.keyword = e, ia[e] = new we(e, t);
}
var b = {
  num: new we("num", ht),
  regexp: new we("regexp", ht),
  string: new we("string", ht),
  name: new we("name", ht),
  privateId: new we("privateId", ht),
  eof: new we("eof"),
  // Punctuation token types.
  bracketL: new we("[", { beforeExpr: !0, startsExpr: !0 }),
  bracketR: new we("]"),
  braceL: new we("{", { beforeExpr: !0, startsExpr: !0 }),
  braceR: new we("}"),
  parenL: new we("(", { beforeExpr: !0, startsExpr: !0 }),
  parenR: new we(")"),
  comma: new we(",", Ft),
  semi: new we(";", Ft),
  colon: new we(":", Ft),
  dot: new we("."),
  question: new we("?", Ft),
  questionDot: new we("?."),
  arrow: new we("=>", Ft),
  template: new we("template"),
  invalidTemplate: new we("invalidTemplate"),
  ellipsis: new we("...", Ft),
  backQuote: new we("`", ht),
  dollarBraceL: new we("${", { beforeExpr: !0, startsExpr: !0 }),
  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.
  eq: new we("=", { beforeExpr: !0, isAssign: !0 }),
  assign: new we("_=", { beforeExpr: !0, isAssign: !0 }),
  incDec: new we("++/--", { prefix: !0, postfix: !0, startsExpr: !0 }),
  prefix: new we("!/~", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  logicalOR: Dt("||", 1),
  logicalAND: Dt("&&", 2),
  bitwiseOR: Dt("|", 3),
  bitwiseXOR: Dt("^", 4),
  bitwiseAND: Dt("&", 5),
  equality: Dt("==/!=/===/!==", 6),
  relational: Dt("</>/<=/>=", 7),
  bitShift: Dt("<</>>/>>>", 8),
  plusMin: new we("+/-", { beforeExpr: !0, binop: 9, prefix: !0, startsExpr: !0 }),
  modulo: Dt("%", 10),
  star: Dt("*", 10),
  slash: Dt("/", 10),
  starstar: new we("**", { beforeExpr: !0 }),
  coalesce: Dt("??", 1),
  // Keyword token types.
  _break: Fe("break"),
  _case: Fe("case", Ft),
  _catch: Fe("catch"),
  _continue: Fe("continue"),
  _debugger: Fe("debugger"),
  _default: Fe("default", Ft),
  _do: Fe("do", { isLoop: !0, beforeExpr: !0 }),
  _else: Fe("else", Ft),
  _finally: Fe("finally"),
  _for: Fe("for", { isLoop: !0 }),
  _function: Fe("function", ht),
  _if: Fe("if"),
  _return: Fe("return", Ft),
  _switch: Fe("switch"),
  _throw: Fe("throw", Ft),
  _try: Fe("try"),
  _var: Fe("var"),
  _const: Fe("const"),
  _while: Fe("while", { isLoop: !0 }),
  _with: Fe("with"),
  _new: Fe("new", { beforeExpr: !0, startsExpr: !0 }),
  _this: Fe("this", ht),
  _super: Fe("super", ht),
  _class: Fe("class", ht),
  _extends: Fe("extends", Ft),
  _export: Fe("export"),
  _import: Fe("import", ht),
  _null: Fe("null", ht),
  _true: Fe("true", ht),
  _false: Fe("false", ht),
  _in: Fe("in", { beforeExpr: !0, binop: 7 }),
  _instanceof: Fe("instanceof", { beforeExpr: !0, binop: 7 }),
  _typeof: Fe("typeof", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  _void: Fe("void", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  _delete: Fe("delete", { beforeExpr: !0, prefix: !0, startsExpr: !0 })
}, kt = /\r\n?|\n|\u2028|\u2029/, fv = new RegExp(kt.source, "g");
function vr(e) {
  return e === 10 || e === 13 || e === 8232 || e === 8233;
}
function Wd(e, t, n) {
  n === void 0 && (n = e.length);
  for (var r = t; r < n; r++) {
    var i = e.charCodeAt(r);
    if (vr(i))
      return r < n - 1 && i === 13 && e.charCodeAt(r + 1) === 10 ? r + 2 : r + 1;
  }
  return -1;
}
var Od = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, Et = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, zd = Object.prototype, hv = zd.hasOwnProperty, pv = zd.toString, Pr = Object.hasOwn || function(e, t) {
  return hv.call(e, t);
}, mo = Array.isArray || function(e) {
  return pv.call(e) === "[object Array]";
}, go = /* @__PURE__ */ Object.create(null);
function Vn(e) {
  return go[e] || (go[e] = new RegExp("^(?:" + e.replace(/ /g, "|") + ")$"));
}
function Pn(e) {
  return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
}
var dv = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, Qr = function(t, n) {
  this.line = t, this.column = n;
};
Qr.prototype.offset = function(t) {
  return new Qr(this.line, this.column + t);
};
var Ji = function(t, n, r) {
  this.start = n, this.end = r, t.sourceFile !== null && (this.source = t.sourceFile);
};
function jd(e, t) {
  for (var n = 1, r = 0; ; ) {
    var i = Wd(e, r, t);
    if (i < 0)
      return new Qr(n, t - r);
    ++n, r = i;
  }
}
var lu = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
  // (the latest version the library supports). This influences
  // support for strict mode, the set of reserved words, and support
  // for new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called when
  // a semicolon is automatically inserted. It will be passed the
  // position of the inserted semicolon as an offset, and if
  // `locations` is enabled, it is given the location as a `{line,
  // column}` object as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: !1,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: !1,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file is
  // allowed and treated as a line comment. Enabled by default when
  // `ecmaVersion` >= 2023.
  allowHashBang: !1,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: !0,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: !1,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  // When this option has an array as value, objects representing the
  // comments are pushed to it.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: !1,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: !1
}, yo = !1;
function mv(e) {
  var t = {};
  for (var n in lu)
    t[n] = e && Pr(e, n) ? e[n] : lu[n];
  if (t.ecmaVersion === "latest" ? t.ecmaVersion = 1e8 : t.ecmaVersion == null ? (!yo && typeof console == "object" && console.warn && (yo = !0, console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)), t.ecmaVersion = 11) : t.ecmaVersion >= 2015 && (t.ecmaVersion -= 2009), t.allowReserved == null && (t.allowReserved = t.ecmaVersion < 5), (!e || e.allowHashBang == null) && (t.allowHashBang = t.ecmaVersion >= 14), mo(t.onToken)) {
    var r = t.onToken;
    t.onToken = function(i) {
      return r.push(i);
    };
  }
  return mo(t.onComment) && (t.onComment = gv(t, t.onComment)), t;
}
function gv(e, t) {
  return function(n, r, i, s, u, a) {
    var o = {
      type: n ? "Block" : "Line",
      value: r,
      start: i,
      end: s
    };
    e.locations && (o.loc = new Ji(this, u, a)), e.ranges && (o.range = [i, s]), t.push(o);
  };
}
var ei = 1, Dr = 2, sa = 4, $d = 8, qd = 16, Kd = 32, ua = 64, Hd = 128, ii = 256, aa = ei | Dr | ii;
function oa(e, t) {
  return Dr | (e ? sa : 0) | (t ? $d : 0);
}
var Ni = 0, ca = 1, Fn = 2, Jd = 3, Yd = 4, Ud = 5, Ue = function(t, n, r) {
  this.options = t = mv(t), this.sourceFile = t.sourceFile, this.keywords = Vn(av[t.ecmaVersion >= 6 ? 6 : t.sourceType === "module" ? "5module" : 5]);
  var i = "";
  t.allowReserved !== !0 && (i = Bs[t.ecmaVersion >= 6 ? 6 : t.ecmaVersion === 5 ? 5 : 3], t.sourceType === "module" && (i += " await")), this.reservedWords = Vn(i);
  var s = (i ? i + " " : "") + Bs.strict;
  this.reservedWordsStrict = Vn(s), this.reservedWordsStrictBind = Vn(s + " " + Bs.strictBind), this.input = String(n), this.containsEsc = !1, r ? (this.pos = r, this.lineStart = this.input.lastIndexOf(`
`, r - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(kt).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = b.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = !0, this.inModule = t.sourceType === "module", this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = !1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = /* @__PURE__ */ Object.create(null), this.pos === 0 && t.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(ei), this.regexpState = null, this.privateNameStack = [];
}, an = { inFunction: { configurable: !0 }, inGenerator: { configurable: !0 }, inAsync: { configurable: !0 }, canAwait: { configurable: !0 }, allowSuper: { configurable: !0 }, allowDirectSuper: { configurable: !0 }, treatFunctionsAsVar: { configurable: !0 }, allowNewDotTarget: { configurable: !0 }, inClassStaticBlock: { configurable: !0 } };
Ue.prototype.parse = function() {
  var t = this.options.program || this.startNode();
  return this.nextToken(), this.parseTopLevel(t);
};
an.inFunction.get = function() {
  return (this.currentVarScope().flags & Dr) > 0;
};
an.inGenerator.get = function() {
  return (this.currentVarScope().flags & $d) > 0 && !this.currentVarScope().inClassFieldInit;
};
an.inAsync.get = function() {
  return (this.currentVarScope().flags & sa) > 0 && !this.currentVarScope().inClassFieldInit;
};
an.canAwait.get = function() {
  for (var e = this.scopeStack.length - 1; e >= 0; e--) {
    var t = this.scopeStack[e];
    if (t.inClassFieldInit || t.flags & ii)
      return !1;
    if (t.flags & Dr)
      return (t.flags & sa) > 0;
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
an.allowSuper.get = function() {
  var e = this.currentThisScope(), t = e.flags, n = e.inClassFieldInit;
  return (t & ua) > 0 || n || this.options.allowSuperOutsideMethod;
};
an.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & Hd) > 0;
};
an.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
an.allowNewDotTarget.get = function() {
  var e = this.currentThisScope(), t = e.flags, n = e.inClassFieldInit;
  return (t & (Dr | ii)) > 0 || n;
};
an.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & ii) > 0;
};
Ue.extend = function() {
  for (var t = [], n = arguments.length; n--; ) t[n] = arguments[n];
  for (var r = this, i = 0; i < t.length; i++)
    r = t[i](r);
  return r;
};
Ue.parse = function(t, n) {
  return new this(n, t).parse();
};
Ue.parseExpressionAt = function(t, n, r) {
  var i = new this(r, t, n);
  return i.nextToken(), i.parseExpression();
};
Ue.tokenizer = function(t, n) {
  return new this(n, t);
};
Object.defineProperties(Ue.prototype, an);
var ot = Ue.prototype, yv = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
ot.strictDirective = function(e) {
  if (this.options.ecmaVersion < 5)
    return !1;
  for (; ; ) {
    Et.lastIndex = e, e += Et.exec(this.input)[0].length;
    var t = yv.exec(this.input.slice(e));
    if (!t)
      return !1;
    if ((t[1] || t[2]) === "use strict") {
      Et.lastIndex = e + t[0].length;
      var n = Et.exec(this.input), r = n.index + n[0].length, i = this.input.charAt(r);
      return i === ";" || i === "}" || kt.test(n[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(i) || i === "!" && this.input.charAt(r + 1) === "=");
    }
    e += t[0].length, Et.lastIndex = e, e += Et.exec(this.input)[0].length, this.input[e] === ";" && e++;
  }
};
ot.eat = function(e) {
  return this.type === e ? (this.next(), !0) : !1;
};
ot.isContextual = function(e) {
  return this.type === b.name && this.value === e && !this.containsEsc;
};
ot.eatContextual = function(e) {
  return this.isContextual(e) ? (this.next(), !0) : !1;
};
ot.expectContextual = function(e) {
  this.eatContextual(e) || this.unexpected();
};
ot.canInsertSemicolon = function() {
  return this.type === b.eof || this.type === b.braceR || kt.test(this.input.slice(this.lastTokEnd, this.start));
};
ot.insertSemicolon = function() {
  if (this.canInsertSemicolon())
    return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), !0;
};
ot.semicolon = function() {
  !this.eat(b.semi) && !this.insertSemicolon() && this.unexpected();
};
ot.afterTrailingComma = function(e, t) {
  if (this.type === e)
    return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t || this.next(), !0;
};
ot.expect = function(e) {
  this.eat(e) || this.unexpected();
};
ot.unexpected = function(e) {
  this.raise(e ?? this.start, "Unexpected token");
};
var Yi = function() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
ot.checkPatternErrors = function(e, t) {
  if (e) {
    e.trailingComma > -1 && this.raiseRecoverable(e.trailingComma, "Comma is not permitted after the rest element");
    var n = t ? e.parenthesizedAssign : e.parenthesizedBind;
    n > -1 && this.raiseRecoverable(n, t ? "Assigning to rvalue" : "Parenthesized pattern");
  }
};
ot.checkExpressionErrors = function(e, t) {
  if (!e)
    return !1;
  var n = e.shorthandAssign, r = e.doubleProto;
  if (!t)
    return n >= 0 || r >= 0;
  n >= 0 && this.raise(n, "Shorthand property assignments are valid only in destructuring patterns"), r >= 0 && this.raiseRecoverable(r, "Redefinition of __proto__ property");
};
ot.checkYieldAwaitInDefaultParams = function() {
  this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
};
ot.isSimpleAssignTarget = function(e) {
  return e.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(e.expression) : e.type === "Identifier" || e.type === "MemberExpression";
};
var Q = Ue.prototype;
Q.parseTopLevel = function(e) {
  var t = /* @__PURE__ */ Object.create(null);
  for (e.body || (e.body = []); this.type !== b.eof; ) {
    var n = this.parseStatement(null, !0, t);
    e.body.push(n);
  }
  if (this.inModule)
    for (var r = 0, i = Object.keys(this.undefinedExports); r < i.length; r += 1) {
      var s = i[r];
      this.raiseRecoverable(this.undefinedExports[s].start, "Export '" + s + "' is not defined");
    }
  return this.adaptDirectivePrologue(e.body), this.next(), e.sourceType = this.options.sourceType, this.finishNode(e, "Program");
};
var la = { kind: "loop" }, bv = { kind: "switch" };
Q.isLet = function(e) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let"))
    return !1;
  Et.lastIndex = this.pos;
  var t = Et.exec(this.input), n = this.pos + t[0].length, r = this.input.charCodeAt(n);
  if (r === 91 || r === 92)
    return !0;
  if (e)
    return !1;
  if (r === 123 || r > 55295 && r < 56320)
    return !0;
  if (vn(r, !0)) {
    for (var i = n + 1; mr(r = this.input.charCodeAt(i), !0); )
      ++i;
    if (r === 92 || r > 55295 && r < 56320)
      return !0;
    var s = this.input.slice(n, i);
    if (!ov.test(s))
      return !0;
  }
  return !1;
};
Q.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
    return !1;
  Et.lastIndex = this.pos;
  var e = Et.exec(this.input), t = this.pos + e[0].length, n;
  return !kt.test(this.input.slice(this.pos, t)) && this.input.slice(t, t + 8) === "function" && (t + 8 === this.input.length || !(mr(n = this.input.charCodeAt(t + 8)) || n > 55295 && n < 56320));
};
Q.parseStatement = function(e, t, n) {
  var r = this.type, i = this.startNode(), s;
  switch (this.isLet(e) && (r = b._var, s = "let"), r) {
    case b._break:
    case b._continue:
      return this.parseBreakContinueStatement(i, r.keyword);
    case b._debugger:
      return this.parseDebuggerStatement(i);
    case b._do:
      return this.parseDoStatement(i);
    case b._for:
      return this.parseForStatement(i);
    case b._function:
      return e && (this.strict || e !== "if" && e !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(i, !1, !e);
    case b._class:
      return e && this.unexpected(), this.parseClass(i, !0);
    case b._if:
      return this.parseIfStatement(i);
    case b._return:
      return this.parseReturnStatement(i);
    case b._switch:
      return this.parseSwitchStatement(i);
    case b._throw:
      return this.parseThrowStatement(i);
    case b._try:
      return this.parseTryStatement(i);
    case b._const:
    case b._var:
      return s = s || this.value, e && s !== "var" && this.unexpected(), this.parseVarStatement(i, s);
    case b._while:
      return this.parseWhileStatement(i);
    case b._with:
      return this.parseWithStatement(i);
    case b.braceL:
      return this.parseBlock(!0, i);
    case b.semi:
      return this.parseEmptyStatement(i);
    case b._export:
    case b._import:
      if (this.options.ecmaVersion > 10 && r === b._import) {
        Et.lastIndex = this.pos;
        var u = Et.exec(this.input), a = this.pos + u[0].length, o = this.input.charCodeAt(a);
        if (o === 40 || o === 46)
          return this.parseExpressionStatement(i, this.parseExpression());
      }
      return this.options.allowImportExportEverywhere || (t || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), r === b._import ? this.parseImport(i) : this.parseExport(i, n);
    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
    default:
      if (this.isAsyncFunction())
        return e && this.unexpected(), this.next(), this.parseFunctionStatement(i, !0, !e);
      var f = this.value, h = this.parseExpression();
      return r === b.name && h.type === "Identifier" && this.eat(b.colon) ? this.parseLabeledStatement(i, f, h, e) : this.parseExpressionStatement(i, h);
  }
};
Q.parseBreakContinueStatement = function(e, t) {
  var n = t === "break";
  this.next(), this.eat(b.semi) || this.insertSemicolon() ? e.label = null : this.type !== b.name ? this.unexpected() : (e.label = this.parseIdent(), this.semicolon());
  for (var r = 0; r < this.labels.length; ++r) {
    var i = this.labels[r];
    if ((e.label == null || i.name === e.label.name) && (i.kind != null && (n || i.kind === "loop") || e.label && n))
      break;
  }
  return r === this.labels.length && this.raise(e.start, "Unsyntactic " + t), this.finishNode(e, n ? "BreakStatement" : "ContinueStatement");
};
Q.parseDebuggerStatement = function(e) {
  return this.next(), this.semicolon(), this.finishNode(e, "DebuggerStatement");
};
Q.parseDoStatement = function(e) {
  return this.next(), this.labels.push(la), e.body = this.parseStatement("do"), this.labels.pop(), this.expect(b._while), e.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(b.semi) : this.semicolon(), this.finishNode(e, "DoWhileStatement");
};
Q.parseForStatement = function(e) {
  this.next();
  var t = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  if (this.labels.push(la), this.enterScope(0), this.expect(b.parenL), this.type === b.semi)
    return t > -1 && this.unexpected(t), this.parseFor(e, null);
  var n = this.isLet();
  if (this.type === b._var || this.type === b._const || n) {
    var r = this.startNode(), i = n ? "let" : this.value;
    return this.next(), this.parseVar(r, !0, i), this.finishNode(r, "VariableDeclaration"), (this.type === b._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && r.declarations.length === 1 ? (this.options.ecmaVersion >= 9 && (this.type === b._in ? t > -1 && this.unexpected(t) : e.await = t > -1), this.parseForIn(e, r)) : (t > -1 && this.unexpected(t), this.parseFor(e, r));
  }
  var s = this.isContextual("let"), u = !1, a = this.containsEsc, o = new Yi(), f = this.start, h = t > -1 ? this.parseExprSubscripts(o, "await") : this.parseExpression(!0, o);
  return this.type === b._in || (u = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (t > -1 ? (this.type === b._in && this.unexpected(t), e.await = !0) : u && this.options.ecmaVersion >= 8 && (h.start === f && !a && h.type === "Identifier" && h.name === "async" ? this.unexpected() : this.options.ecmaVersion >= 9 && (e.await = !1)), s && u && this.raise(h.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(h, !1, o), this.checkLValPattern(h), this.parseForIn(e, h)) : (this.checkExpressionErrors(o, !0), t > -1 && this.unexpected(t), this.parseFor(e, h));
};
Q.parseFunctionStatement = function(e, t, n) {
  return this.next(), this.parseFunction(e, $r | (n ? 0 : fu), !1, t);
};
Q.parseIfStatement = function(e) {
  return this.next(), e.test = this.parseParenExpression(), e.consequent = this.parseStatement("if"), e.alternate = this.eat(b._else) ? this.parseStatement("if") : null, this.finishNode(e, "IfStatement");
};
Q.parseReturnStatement = function(e) {
  return !this.inFunction && !this.options.allowReturnOutsideFunction && this.raise(this.start, "'return' outside of function"), this.next(), this.eat(b.semi) || this.insertSemicolon() ? e.argument = null : (e.argument = this.parseExpression(), this.semicolon()), this.finishNode(e, "ReturnStatement");
};
Q.parseSwitchStatement = function(e) {
  this.next(), e.discriminant = this.parseParenExpression(), e.cases = [], this.expect(b.braceL), this.labels.push(bv), this.enterScope(0);
  for (var t, n = !1; this.type !== b.braceR; )
    if (this.type === b._case || this.type === b._default) {
      var r = this.type === b._case;
      t && this.finishNode(t, "SwitchCase"), e.cases.push(t = this.startNode()), t.consequent = [], this.next(), r ? t.test = this.parseExpression() : (n && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), n = !0, t.test = null), this.expect(b.colon);
    } else
      t || this.unexpected(), t.consequent.push(this.parseStatement(null));
  return this.exitScope(), t && this.finishNode(t, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e, "SwitchStatement");
};
Q.parseThrowStatement = function(e) {
  return this.next(), kt.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e.argument = this.parseExpression(), this.semicolon(), this.finishNode(e, "ThrowStatement");
};
var Av = [];
Q.parseCatchClauseParam = function() {
  var e = this.parseBindingAtom(), t = e.type === "Identifier";
  return this.enterScope(t ? Kd : 0), this.checkLValPattern(e, t ? Yd : Fn), this.expect(b.parenR), e;
};
Q.parseTryStatement = function(e) {
  if (this.next(), e.block = this.parseBlock(), e.handler = null, this.type === b._catch) {
    var t = this.startNode();
    this.next(), this.eat(b.parenL) ? t.param = this.parseCatchClauseParam() : (this.options.ecmaVersion < 10 && this.unexpected(), t.param = null, this.enterScope(0)), t.body = this.parseBlock(!1), this.exitScope(), e.handler = this.finishNode(t, "CatchClause");
  }
  return e.finalizer = this.eat(b._finally) ? this.parseBlock() : null, !e.handler && !e.finalizer && this.raise(e.start, "Missing catch or finally clause"), this.finishNode(e, "TryStatement");
};
Q.parseVarStatement = function(e, t, n) {
  return this.next(), this.parseVar(e, !1, t, n), this.semicolon(), this.finishNode(e, "VariableDeclaration");
};
Q.parseWhileStatement = function(e) {
  return this.next(), e.test = this.parseParenExpression(), this.labels.push(la), e.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e, "WhileStatement");
};
Q.parseWithStatement = function(e) {
  return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e.object = this.parseParenExpression(), e.body = this.parseStatement("with"), this.finishNode(e, "WithStatement");
};
Q.parseEmptyStatement = function(e) {
  return this.next(), this.finishNode(e, "EmptyStatement");
};
Q.parseLabeledStatement = function(e, t, n, r) {
  for (var i = 0, s = this.labels; i < s.length; i += 1) {
    var u = s[i];
    u.name === t && this.raise(n.start, "Label '" + t + "' is already declared");
  }
  for (var a = this.type.isLoop ? "loop" : this.type === b._switch ? "switch" : null, o = this.labels.length - 1; o >= 0; o--) {
    var f = this.labels[o];
    if (f.statementStart === e.start)
      f.statementStart = this.start, f.kind = a;
    else
      break;
  }
  return this.labels.push({ name: t, kind: a, statementStart: this.start }), e.body = this.parseStatement(r ? r.indexOf("label") === -1 ? r + "label" : r : "label"), this.labels.pop(), e.label = n, this.finishNode(e, "LabeledStatement");
};
Q.parseExpressionStatement = function(e, t) {
  return e.expression = t, this.semicolon(), this.finishNode(e, "ExpressionStatement");
};
Q.parseBlock = function(e, t, n) {
  for (e === void 0 && (e = !0), t === void 0 && (t = this.startNode()), t.body = [], this.expect(b.braceL), e && this.enterScope(0); this.type !== b.braceR; ) {
    var r = this.parseStatement(null);
    t.body.push(r);
  }
  return n && (this.strict = !1), this.next(), e && this.exitScope(), this.finishNode(t, "BlockStatement");
};
Q.parseFor = function(e, t) {
  return e.init = t, this.expect(b.semi), e.test = this.type === b.semi ? null : this.parseExpression(), this.expect(b.semi), e.update = this.type === b.parenR ? null : this.parseExpression(), this.expect(b.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, "ForStatement");
};
Q.parseForIn = function(e, t) {
  var n = this.type === b._in;
  return this.next(), t.type === "VariableDeclaration" && t.declarations[0].init != null && (!n || this.options.ecmaVersion < 8 || this.strict || t.kind !== "var" || t.declarations[0].id.type !== "Identifier") && this.raise(
    t.start,
    (n ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
  ), e.left = t, e.right = n ? this.parseExpression() : this.parseMaybeAssign(), this.expect(b.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, n ? "ForInStatement" : "ForOfStatement");
};
Q.parseVar = function(e, t, n, r) {
  for (e.declarations = [], e.kind = n; ; ) {
    var i = this.startNode();
    if (this.parseVarId(i, n), this.eat(b.eq) ? i.init = this.parseMaybeAssign(t) : !r && n === "const" && !(this.type === b._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) ? this.unexpected() : !r && i.id.type !== "Identifier" && !(t && (this.type === b._in || this.isContextual("of"))) ? this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : i.init = null, e.declarations.push(this.finishNode(i, "VariableDeclarator")), !this.eat(b.comma))
      break;
  }
  return e;
};
Q.parseVarId = function(e, t) {
  e.id = this.parseBindingAtom(), this.checkLValPattern(e.id, t === "var" ? ca : Fn, !1);
};
var $r = 1, fu = 2, Qd = 4;
Q.parseFunction = function(e, t, n, r, i) {
  this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !r) && (this.type === b.star && t & fu && this.unexpected(), e.generator = this.eat(b.star)), this.options.ecmaVersion >= 8 && (e.async = !!r), t & $r && (e.id = t & Qd && this.type !== b.name ? null : this.parseIdent(), e.id && !(t & fu) && this.checkLValSimple(e.id, this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? ca : Fn : Jd));
  var s = this.yieldPos, u = this.awaitPos, a = this.awaitIdentPos;
  return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(oa(e.async, e.generator)), t & $r || (e.id = this.type === b.name ? this.parseIdent() : null), this.parseFunctionParams(e), this.parseFunctionBody(e, n, !1, i), this.yieldPos = s, this.awaitPos = u, this.awaitIdentPos = a, this.finishNode(e, t & $r ? "FunctionDeclaration" : "FunctionExpression");
};
Q.parseFunctionParams = function(e) {
  this.expect(b.parenL), e.params = this.parseBindingList(b.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
};
Q.parseClass = function(e, t) {
  this.next();
  var n = this.strict;
  this.strict = !0, this.parseClassId(e, t), this.parseClassSuper(e);
  var r = this.enterClassBody(), i = this.startNode(), s = !1;
  for (i.body = [], this.expect(b.braceL); this.type !== b.braceR; ) {
    var u = this.parseClassElement(e.superClass !== null);
    u && (i.body.push(u), u.type === "MethodDefinition" && u.kind === "constructor" ? (s && this.raiseRecoverable(u.start, "Duplicate constructor in the same class"), s = !0) : u.key && u.key.type === "PrivateIdentifier" && Mv(r, u) && this.raiseRecoverable(u.key.start, "Identifier '#" + u.key.name + "' has already been declared"));
  }
  return this.strict = n, this.next(), e.body = this.finishNode(i, "ClassBody"), this.exitClassBody(), this.finishNode(e, t ? "ClassDeclaration" : "ClassExpression");
};
Q.parseClassElement = function(e) {
  if (this.eat(b.semi))
    return null;
  var t = this.options.ecmaVersion, n = this.startNode(), r = "", i = !1, s = !1, u = "method", a = !1;
  if (this.eatContextual("static")) {
    if (t >= 13 && this.eat(b.braceL))
      return this.parseClassStaticBlock(n), n;
    this.isClassElementNameStart() || this.type === b.star ? a = !0 : r = "static";
  }
  if (n.static = a, !r && t >= 8 && this.eatContextual("async") && ((this.isClassElementNameStart() || this.type === b.star) && !this.canInsertSemicolon() ? s = !0 : r = "async"), !r && (t >= 9 || !s) && this.eat(b.star) && (i = !0), !r && !s && !i) {
    var o = this.value;
    (this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? u = o : r = o);
  }
  if (r ? (n.computed = !1, n.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), n.key.name = r, this.finishNode(n.key, "Identifier")) : this.parseClassElementName(n), t < 13 || this.type === b.parenL || u !== "method" || i || s) {
    var f = !n.static && Ti(n, "constructor"), h = f && e;
    f && u !== "method" && this.raise(n.key.start, "Constructor can't have get/set modifier"), n.kind = f ? "constructor" : u, this.parseClassMethod(n, i, s, h);
  } else
    this.parseClassField(n);
  return n;
};
Q.isClassElementNameStart = function() {
  return this.type === b.name || this.type === b.privateId || this.type === b.num || this.type === b.string || this.type === b.bracketL || this.type.keyword;
};
Q.parseClassElementName = function(e) {
  this.type === b.privateId ? (this.value === "constructor" && this.raise(this.start, "Classes can't have an element named '#constructor'"), e.computed = !1, e.key = this.parsePrivateIdent()) : this.parsePropertyName(e);
};
Q.parseClassMethod = function(e, t, n, r) {
  var i = e.key;
  e.kind === "constructor" ? (t && this.raise(i.start, "Constructor can't be a generator"), n && this.raise(i.start, "Constructor can't be an async method")) : e.static && Ti(e, "prototype") && this.raise(i.start, "Classes may not have a static property named prototype");
  var s = e.value = this.parseMethod(t, n, r);
  return e.kind === "get" && s.params.length !== 0 && this.raiseRecoverable(s.start, "getter should have no params"), e.kind === "set" && s.params.length !== 1 && this.raiseRecoverable(s.start, "setter should have exactly one param"), e.kind === "set" && s.params[0].type === "RestElement" && this.raiseRecoverable(s.params[0].start, "Setter cannot use rest params"), this.finishNode(e, "MethodDefinition");
};
Q.parseClassField = function(e) {
  if (Ti(e, "constructor") ? this.raise(e.key.start, "Classes can't have a field named 'constructor'") : e.static && Ti(e, "prototype") && this.raise(e.key.start, "Classes can't have a static field named 'prototype'"), this.eat(b.eq)) {
    var t = this.currentThisScope(), n = t.inClassFieldInit;
    t.inClassFieldInit = !0, e.value = this.parseMaybeAssign(), t.inClassFieldInit = n;
  } else
    e.value = null;
  return this.semicolon(), this.finishNode(e, "PropertyDefinition");
};
Q.parseClassStaticBlock = function(e) {
  e.body = [];
  var t = this.labels;
  for (this.labels = [], this.enterScope(ii | ua); this.type !== b.braceR; ) {
    var n = this.parseStatement(null);
    e.body.push(n);
  }
  return this.next(), this.exitScope(), this.labels = t, this.finishNode(e, "StaticBlock");
};
Q.parseClassId = function(e, t) {
  this.type === b.name ? (e.id = this.parseIdent(), t && this.checkLValSimple(e.id, Fn, !1)) : (t === !0 && this.unexpected(), e.id = null);
};
Q.parseClassSuper = function(e) {
  e.superClass = this.eat(b._extends) ? this.parseExprSubscripts(null, !1) : null;
};
Q.enterClassBody = function() {
  var e = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  return this.privateNameStack.push(e), e.declared;
};
Q.exitClassBody = function() {
  var e = this.privateNameStack.pop(), t = e.declared, n = e.used;
  if (this.options.checkPrivateFields)
    for (var r = this.privateNameStack.length, i = r === 0 ? null : this.privateNameStack[r - 1], s = 0; s < n.length; ++s) {
      var u = n[s];
      Pr(t, u.name) || (i ? i.used.push(u) : this.raiseRecoverable(u.start, "Private field '#" + u.name + "' must be declared in an enclosing class"));
    }
};
function Mv(e, t) {
  var n = t.key.name, r = e[n], i = "true";
  return t.type === "MethodDefinition" && (t.kind === "get" || t.kind === "set") && (i = (t.static ? "s" : "i") + t.kind), r === "iget" && i === "iset" || r === "iset" && i === "iget" || r === "sget" && i === "sset" || r === "sset" && i === "sget" ? (e[n] = "true", !1) : r ? !0 : (e[n] = i, !1);
}
function Ti(e, t) {
  var n = e.computed, r = e.key;
  return !n && (r.type === "Identifier" && r.name === t || r.type === "Literal" && r.value === t);
}
Q.parseExportAllDeclaration = function(e, t) {
  return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e.exported = this.parseModuleExportName(), this.checkExport(t, e.exported, this.lastTokStart)) : e.exported = null), this.expectContextual("from"), this.type !== b.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");
};
Q.parseExport = function(e, t) {
  if (this.next(), this.eat(b.star))
    return this.parseExportAllDeclaration(e, t);
  if (this.eat(b._default))
    return this.checkExport(t, "default", this.lastTokStart), e.declaration = this.parseExportDefaultDeclaration(), this.finishNode(e, "ExportDefaultDeclaration");
  if (this.shouldParseExportStatement())
    e.declaration = this.parseExportDeclaration(e), e.declaration.type === "VariableDeclaration" ? this.checkVariableExport(t, e.declaration.declarations) : this.checkExport(t, e.declaration.id, e.declaration.id.start), e.specifiers = [], e.source = null;
  else {
    if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(t), this.eatContextual("from"))
      this.type !== b.string && this.unexpected(), e.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause());
    else {
      for (var n = 0, r = e.specifiers; n < r.length; n += 1) {
        var i = r[n];
        this.checkUnreserved(i.local), this.checkLocalExport(i.local), i.local.type === "Literal" && this.raise(i.local.start, "A string literal cannot be used as an exported binding without `from`.");
      }
      e.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(e, "ExportNamedDeclaration");
};
Q.parseExportDeclaration = function(e) {
  return this.parseStatement(null);
};
Q.parseExportDefaultDeclaration = function() {
  var e;
  if (this.type === b._function || (e = this.isAsyncFunction())) {
    var t = this.startNode();
    return this.next(), e && this.next(), this.parseFunction(t, $r | Qd, !1, e);
  } else if (this.type === b._class) {
    var n = this.startNode();
    return this.parseClass(n, "nullableID");
  } else {
    var r = this.parseMaybeAssign();
    return this.semicolon(), r;
  }
};
Q.checkExport = function(e, t, n) {
  e && (typeof t != "string" && (t = t.type === "Identifier" ? t.name : t.value), Pr(e, t) && this.raiseRecoverable(n, "Duplicate export '" + t + "'"), e[t] = !0);
};
Q.checkPatternExport = function(e, t) {
  var n = t.type;
  if (n === "Identifier")
    this.checkExport(e, t, t.start);
  else if (n === "ObjectPattern")
    for (var r = 0, i = t.properties; r < i.length; r += 1) {
      var s = i[r];
      this.checkPatternExport(e, s);
    }
  else if (n === "ArrayPattern")
    for (var u = 0, a = t.elements; u < a.length; u += 1) {
      var o = a[u];
      o && this.checkPatternExport(e, o);
    }
  else n === "Property" ? this.checkPatternExport(e, t.value) : n === "AssignmentPattern" ? this.checkPatternExport(e, t.left) : n === "RestElement" && this.checkPatternExport(e, t.argument);
};
Q.checkVariableExport = function(e, t) {
  if (e)
    for (var n = 0, r = t; n < r.length; n += 1) {
      var i = r[n];
      this.checkPatternExport(e, i.id);
    }
};
Q.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
Q.parseExportSpecifier = function(e) {
  var t = this.startNode();
  return t.local = this.parseModuleExportName(), t.exported = this.eatContextual("as") ? this.parseModuleExportName() : t.local, this.checkExport(
    e,
    t.exported,
    t.exported.start
  ), this.finishNode(t, "ExportSpecifier");
};
Q.parseExportSpecifiers = function(e) {
  var t = [], n = !0;
  for (this.expect(b.braceL); !this.eat(b.braceR); ) {
    if (n)
      n = !1;
    else if (this.expect(b.comma), this.afterTrailingComma(b.braceR))
      break;
    t.push(this.parseExportSpecifier(e));
  }
  return t;
};
Q.parseImport = function(e) {
  return this.next(), this.type === b.string ? (e.specifiers = Av, e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === b.string ? this.parseExprAtom() : this.unexpected()), this.options.ecmaVersion >= 16 && (e.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e, "ImportDeclaration");
};
Q.parseImportSpecifier = function() {
  var e = this.startNode();
  return e.imported = this.parseModuleExportName(), this.eatContextual("as") ? e.local = this.parseIdent() : (this.checkUnreserved(e.imported), e.local = e.imported), this.checkLValSimple(e.local, Fn), this.finishNode(e, "ImportSpecifier");
};
Q.parseImportDefaultSpecifier = function() {
  var e = this.startNode();
  return e.local = this.parseIdent(), this.checkLValSimple(e.local, Fn), this.finishNode(e, "ImportDefaultSpecifier");
};
Q.parseImportNamespaceSpecifier = function() {
  var e = this.startNode();
  return this.next(), this.expectContextual("as"), e.local = this.parseIdent(), this.checkLValSimple(e.local, Fn), this.finishNode(e, "ImportNamespaceSpecifier");
};
Q.parseImportSpecifiers = function() {
  var e = [], t = !0;
  if (this.type === b.name && (e.push(this.parseImportDefaultSpecifier()), !this.eat(b.comma)))
    return e;
  if (this.type === b.star)
    return e.push(this.parseImportNamespaceSpecifier()), e;
  for (this.expect(b.braceL); !this.eat(b.braceR); ) {
    if (t)
      t = !1;
    else if (this.expect(b.comma), this.afterTrailingComma(b.braceR))
      break;
    e.push(this.parseImportSpecifier());
  }
  return e;
};
Q.parseWithClause = function() {
  var e = [];
  if (!this.eat(b._with))
    return e;
  this.expect(b.braceL);
  for (var t = {}, n = !0; !this.eat(b.braceR); ) {
    if (n)
      n = !1;
    else if (this.expect(b.comma), this.afterTrailingComma(b.braceR))
      break;
    var r = this.parseImportAttribute(), i = r.key.type === "Identifier" ? r.key.name : r.key.value;
    Pr(t, i) && this.raiseRecoverable(r.key.start, "Duplicate attribute key '" + i + "'"), t[i] = !0, e.push(r);
  }
  return e;
};
Q.parseImportAttribute = function() {
  var e = this.startNode();
  return e.key = this.type === b.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never"), this.expect(b.colon), this.type !== b.string && this.unexpected(), e.value = this.parseExprAtom(), this.finishNode(e, "ImportAttribute");
};
Q.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === b.string) {
    var e = this.parseLiteral(this.value);
    return dv.test(e.value) && this.raise(e.start, "An export name cannot include a lone surrogate."), e;
  }
  return this.parseIdent(!0);
};
Q.adaptDirectivePrologue = function(e) {
  for (var t = 0; t < e.length && this.isDirectiveCandidate(e[t]); ++t)
    e[t].directive = e[t].expression.raw.slice(1, -1);
};
Q.isDirectiveCandidate = function(e) {
  return this.options.ecmaVersion >= 5 && e.type === "ExpressionStatement" && e.expression.type === "Literal" && typeof e.expression.value == "string" && // Reject parenthesized strings.
  (this.input[e.start] === '"' || this.input[e.start] === "'");
};
var It = Ue.prototype;
It.toAssignable = function(e, t, n) {
  if (this.options.ecmaVersion >= 6 && e)
    switch (e.type) {
      case "Identifier":
        this.inAsync && e.name === "await" && this.raise(e.start, "Cannot use 'await' as identifier inside an async function");
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        e.type = "ObjectPattern", n && this.checkPatternErrors(n, !0);
        for (var r = 0, i = e.properties; r < i.length; r += 1) {
          var s = i[r];
          this.toAssignable(s, t), s.type === "RestElement" && (s.argument.type === "ArrayPattern" || s.argument.type === "ObjectPattern") && this.raise(s.argument.start, "Unexpected token");
        }
        break;
      case "Property":
        e.kind !== "init" && this.raise(e.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e.value, t);
        break;
      case "ArrayExpression":
        e.type = "ArrayPattern", n && this.checkPatternErrors(n, !0), this.toAssignableList(e.elements, t);
        break;
      case "SpreadElement":
        e.type = "RestElement", this.toAssignable(e.argument, t), e.argument.type === "AssignmentPattern" && this.raise(e.argument.start, "Rest elements cannot have a default value");
        break;
      case "AssignmentExpression":
        e.operator !== "=" && this.raise(e.left.end, "Only '=' operator can be used for specifying default value."), e.type = "AssignmentPattern", delete e.operator, this.toAssignable(e.left, t);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(e.expression, t, n);
        break;
      case "ChainExpression":
        this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!t)
          break;
      default:
        this.raise(e.start, "Assigning to rvalue");
    }
  else n && this.checkPatternErrors(n, !0);
  return e;
};
It.toAssignableList = function(e, t) {
  for (var n = e.length, r = 0; r < n; r++) {
    var i = e[r];
    i && this.toAssignable(i, t);
  }
  if (n) {
    var s = e[n - 1];
    this.options.ecmaVersion === 6 && t && s && s.type === "RestElement" && s.argument.type !== "Identifier" && this.unexpected(s.argument.start);
  }
  return e;
};
It.parseSpread = function(e) {
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeAssign(!1, e), this.finishNode(t, "SpreadElement");
};
It.parseRestBinding = function() {
  var e = this.startNode();
  return this.next(), this.options.ecmaVersion === 6 && this.type !== b.name && this.unexpected(), e.argument = this.parseBindingAtom(), this.finishNode(e, "RestElement");
};
It.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6)
    switch (this.type) {
      case b.bracketL:
        var e = this.startNode();
        return this.next(), e.elements = this.parseBindingList(b.bracketR, !0, !0), this.finishNode(e, "ArrayPattern");
      case b.braceL:
        return this.parseObj(!0);
    }
  return this.parseIdent();
};
It.parseBindingList = function(e, t, n, r) {
  for (var i = [], s = !0; !this.eat(e); )
    if (s ? s = !1 : this.expect(b.comma), t && this.type === b.comma)
      i.push(null);
    else {
      if (n && this.afterTrailingComma(e))
        break;
      if (this.type === b.ellipsis) {
        var u = this.parseRestBinding();
        this.parseBindingListItem(u), i.push(u), this.type === b.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.expect(e);
        break;
      } else
        i.push(this.parseAssignableListItem(r));
    }
  return i;
};
It.parseAssignableListItem = function(e) {
  var t = this.parseMaybeDefault(this.start, this.startLoc);
  return this.parseBindingListItem(t), t;
};
It.parseBindingListItem = function(e) {
  return e;
};
It.parseMaybeDefault = function(e, t, n) {
  if (n = n || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(b.eq))
    return n;
  var r = this.startNodeAt(e, t);
  return r.left = n, r.right = this.parseMaybeAssign(), this.finishNode(r, "AssignmentPattern");
};
It.checkLValSimple = function(e, t, n) {
  t === void 0 && (t = Ni);
  var r = t !== Ni;
  switch (e.type) {
    case "Identifier":
      this.strict && this.reservedWordsStrictBind.test(e.name) && this.raiseRecoverable(e.start, (r ? "Binding " : "Assigning to ") + e.name + " in strict mode"), r && (t === Fn && e.name === "let" && this.raiseRecoverable(e.start, "let is disallowed as a lexically bound name"), n && (Pr(n, e.name) && this.raiseRecoverable(e.start, "Argument name clash"), n[e.name] = !0), t !== Ud && this.declareName(e.name, t, e.start));
      break;
    case "ChainExpression":
      this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      r && this.raiseRecoverable(e.start, "Binding member expression");
      break;
    case "ParenthesizedExpression":
      return r && this.raiseRecoverable(e.start, "Binding parenthesized expression"), this.checkLValSimple(e.expression, t, n);
    default:
      this.raise(e.start, (r ? "Binding" : "Assigning to") + " rvalue");
  }
};
It.checkLValPattern = function(e, t, n) {
  switch (t === void 0 && (t = Ni), e.type) {
    case "ObjectPattern":
      for (var r = 0, i = e.properties; r < i.length; r += 1) {
        var s = i[r];
        this.checkLValInnerPattern(s, t, n);
      }
      break;
    case "ArrayPattern":
      for (var u = 0, a = e.elements; u < a.length; u += 1) {
        var o = a[u];
        o && this.checkLValInnerPattern(o, t, n);
      }
      break;
    default:
      this.checkLValSimple(e, t, n);
  }
};
It.checkLValInnerPattern = function(e, t, n) {
  switch (t === void 0 && (t = Ni), e.type) {
    case "Property":
      this.checkLValInnerPattern(e.value, t, n);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(e.left, t, n);
      break;
    case "RestElement":
      this.checkLValPattern(e.argument, t, n);
      break;
    default:
      this.checkLValPattern(e, t, n);
  }
};
var Zt = function(t, n, r, i, s) {
  this.token = t, this.isExpr = !!n, this.preserveSpace = !!r, this.override = i, this.generator = !!s;
}, Xe = {
  b_stat: new Zt("{", !1),
  b_expr: new Zt("{", !0),
  b_tmpl: new Zt("${", !1),
  p_stat: new Zt("(", !1),
  p_expr: new Zt("(", !0),
  q_tmpl: new Zt("`", !0, !0, function(e) {
    return e.tryReadTemplateToken();
  }),
  f_stat: new Zt("function", !1),
  f_expr: new Zt("function", !0),
  f_expr_gen: new Zt("function", !0, !1, null, !0),
  f_gen: new Zt("function", !1, !1, null, !0)
}, Fr = Ue.prototype;
Fr.initialContext = function() {
  return [Xe.b_stat];
};
Fr.curContext = function() {
  return this.context[this.context.length - 1];
};
Fr.braceIsBlock = function(e) {
  var t = this.curContext();
  return t === Xe.f_expr || t === Xe.f_stat ? !0 : e === b.colon && (t === Xe.b_stat || t === Xe.b_expr) ? !t.isExpr : e === b._return || e === b.name && this.exprAllowed ? kt.test(this.input.slice(this.lastTokEnd, this.start)) : e === b._else || e === b.semi || e === b.eof || e === b.parenR || e === b.arrow ? !0 : e === b.braceL ? t === Xe.b_stat : e === b._var || e === b._const || e === b.name ? !1 : !this.exprAllowed;
};
Fr.inGeneratorContext = function() {
  for (var e = this.context.length - 1; e >= 1; e--) {
    var t = this.context[e];
    if (t.token === "function")
      return t.generator;
  }
  return !1;
};
Fr.updateContext = function(e) {
  var t, n = this.type;
  n.keyword && e === b.dot ? this.exprAllowed = !1 : (t = n.updateContext) ? t.call(this, e) : this.exprAllowed = n.beforeExpr;
};
Fr.overrideContext = function(e) {
  this.curContext() !== e && (this.context[this.context.length - 1] = e);
};
b.parenR.updateContext = b.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = !0;
    return;
  }
  var e = this.context.pop();
  e === Xe.b_stat && this.curContext().token === "function" && (e = this.context.pop()), this.exprAllowed = !e.isExpr;
};
b.braceL.updateContext = function(e) {
  this.context.push(this.braceIsBlock(e) ? Xe.b_stat : Xe.b_expr), this.exprAllowed = !0;
};
b.dollarBraceL.updateContext = function() {
  this.context.push(Xe.b_tmpl), this.exprAllowed = !0;
};
b.parenL.updateContext = function(e) {
  var t = e === b._if || e === b._for || e === b._with || e === b._while;
  this.context.push(t ? Xe.p_stat : Xe.p_expr), this.exprAllowed = !0;
};
b.incDec.updateContext = function() {
};
b._function.updateContext = b._class.updateContext = function(e) {
  e.beforeExpr && e !== b._else && !(e === b.semi && this.curContext() !== Xe.p_stat) && !(e === b._return && kt.test(this.input.slice(this.lastTokEnd, this.start))) && !((e === b.colon || e === b.braceL) && this.curContext() === Xe.b_stat) ? this.context.push(Xe.f_expr) : this.context.push(Xe.f_stat), this.exprAllowed = !1;
};
b.colon.updateContext = function() {
  this.curContext().token === "function" && this.context.pop(), this.exprAllowed = !0;
};
b.backQuote.updateContext = function() {
  this.curContext() === Xe.q_tmpl ? this.context.pop() : this.context.push(Xe.q_tmpl), this.exprAllowed = !1;
};
b.star.updateContext = function(e) {
  if (e === b._function) {
    var t = this.context.length - 1;
    this.context[t] === Xe.f_expr ? this.context[t] = Xe.f_expr_gen : this.context[t] = Xe.f_gen;
  }
  this.exprAllowed = !0;
};
b.name.updateContext = function(e) {
  var t = !1;
  this.options.ecmaVersion >= 6 && e !== b.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (t = !0), this.exprAllowed = t;
};
var ce = Ue.prototype;
ce.checkPropClash = function(e, t, n) {
  if (!(this.options.ecmaVersion >= 9 && e.type === "SpreadElement") && !(this.options.ecmaVersion >= 6 && (e.computed || e.method || e.shorthand))) {
    var r = e.key, i;
    switch (r.type) {
      case "Identifier":
        i = r.name;
        break;
      case "Literal":
        i = String(r.value);
        break;
      default:
        return;
    }
    var s = e.kind;
    if (this.options.ecmaVersion >= 6) {
      i === "__proto__" && s === "init" && (t.proto && (n ? n.doubleProto < 0 && (n.doubleProto = r.start) : this.raiseRecoverable(r.start, "Redefinition of __proto__ property")), t.proto = !0);
      return;
    }
    i = "$" + i;
    var u = t[i];
    if (u) {
      var a;
      s === "init" ? a = this.strict && u.init || u.get || u.set : a = u.init || u[s], a && this.raiseRecoverable(r.start, "Redefinition of property");
    } else
      u = t[i] = {
        init: !1,
        get: !1,
        set: !1
      };
    u[s] = !0;
  }
};
ce.parseExpression = function(e, t) {
  var n = this.start, r = this.startLoc, i = this.parseMaybeAssign(e, t);
  if (this.type === b.comma) {
    var s = this.startNodeAt(n, r);
    for (s.expressions = [i]; this.eat(b.comma); )
      s.expressions.push(this.parseMaybeAssign(e, t));
    return this.finishNode(s, "SequenceExpression");
  }
  return i;
};
ce.parseMaybeAssign = function(e, t, n) {
  if (this.isContextual("yield")) {
    if (this.inGenerator)
      return this.parseYield(e);
    this.exprAllowed = !1;
  }
  var r = !1, i = -1, s = -1, u = -1;
  t ? (i = t.parenthesizedAssign, s = t.trailingComma, u = t.doubleProto, t.parenthesizedAssign = t.trailingComma = -1) : (t = new Yi(), r = !0);
  var a = this.start, o = this.startLoc;
  (this.type === b.parenL || this.type === b.name) && (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = e === "await");
  var f = this.parseMaybeConditional(e, t);
  if (n && (f = n.call(this, f, a, o)), this.type.isAssign) {
    var h = this.startNodeAt(a, o);
    return h.operator = this.value, this.type === b.eq && (f = this.toAssignable(f, !1, t)), r || (t.parenthesizedAssign = t.trailingComma = t.doubleProto = -1), t.shorthandAssign >= f.start && (t.shorthandAssign = -1), this.type === b.eq ? this.checkLValPattern(f) : this.checkLValSimple(f), h.left = f, this.next(), h.right = this.parseMaybeAssign(e), u > -1 && (t.doubleProto = u), this.finishNode(h, "AssignmentExpression");
  } else
    r && this.checkExpressionErrors(t, !0);
  return i > -1 && (t.parenthesizedAssign = i), s > -1 && (t.trailingComma = s), f;
};
ce.parseMaybeConditional = function(e, t) {
  var n = this.start, r = this.startLoc, i = this.parseExprOps(e, t);
  if (this.checkExpressionErrors(t))
    return i;
  if (this.eat(b.question)) {
    var s = this.startNodeAt(n, r);
    return s.test = i, s.consequent = this.parseMaybeAssign(), this.expect(b.colon), s.alternate = this.parseMaybeAssign(e), this.finishNode(s, "ConditionalExpression");
  }
  return i;
};
ce.parseExprOps = function(e, t) {
  var n = this.start, r = this.startLoc, i = this.parseMaybeUnary(t, !1, !1, e);
  return this.checkExpressionErrors(t) || i.start === n && i.type === "ArrowFunctionExpression" ? i : this.parseExprOp(i, n, r, -1, e);
};
ce.parseExprOp = function(e, t, n, r, i) {
  var s = this.type.binop;
  if (s != null && (!i || this.type !== b._in) && s > r) {
    var u = this.type === b.logicalOR || this.type === b.logicalAND, a = this.type === b.coalesce;
    a && (s = b.logicalAND.binop);
    var o = this.value;
    this.next();
    var f = this.start, h = this.startLoc, m = this.parseExprOp(this.parseMaybeUnary(null, !1, !1, i), f, h, s, i), p = this.buildBinary(t, n, e, m, o, u || a);
    return (u && this.type === b.coalesce || a && (this.type === b.logicalOR || this.type === b.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(p, t, n, r, i);
  }
  return e;
};
ce.buildBinary = function(e, t, n, r, i, s) {
  r.type === "PrivateIdentifier" && this.raise(r.start, "Private identifier can only be left side of binary expression");
  var u = this.startNodeAt(e, t);
  return u.left = n, u.operator = i, u.right = r, this.finishNode(u, s ? "LogicalExpression" : "BinaryExpression");
};
ce.parseMaybeUnary = function(e, t, n, r) {
  var i = this.start, s = this.startLoc, u;
  if (this.isContextual("await") && this.canAwait)
    u = this.parseAwait(r), t = !0;
  else if (this.type.prefix) {
    var a = this.startNode(), o = this.type === b.incDec;
    a.operator = this.value, a.prefix = !0, this.next(), a.argument = this.parseMaybeUnary(null, !0, o, r), this.checkExpressionErrors(e, !0), o ? this.checkLValSimple(a.argument) : this.strict && a.operator === "delete" && em(a.argument) ? this.raiseRecoverable(a.start, "Deleting local variable in strict mode") : a.operator === "delete" && hu(a.argument) ? this.raiseRecoverable(a.start, "Private fields can not be deleted") : t = !0, u = this.finishNode(a, o ? "UpdateExpression" : "UnaryExpression");
  } else if (!t && this.type === b.privateId)
    (r || this.privateNameStack.length === 0) && this.options.checkPrivateFields && this.unexpected(), u = this.parsePrivateIdent(), this.type !== b._in && this.unexpected();
  else {
    if (u = this.parseExprSubscripts(e, r), this.checkExpressionErrors(e))
      return u;
    for (; this.type.postfix && !this.canInsertSemicolon(); ) {
      var f = this.startNodeAt(i, s);
      f.operator = this.value, f.prefix = !1, f.argument = u, this.checkLValSimple(u), this.next(), u = this.finishNode(f, "UpdateExpression");
    }
  }
  if (!n && this.eat(b.starstar))
    if (t)
      this.unexpected(this.lastTokStart);
    else
      return this.buildBinary(i, s, u, this.parseMaybeUnary(null, !1, !1, r), "**", !1);
  else
    return u;
};
function em(e) {
  return e.type === "Identifier" || e.type === "ParenthesizedExpression" && em(e.expression);
}
function hu(e) {
  return e.type === "MemberExpression" && e.property.type === "PrivateIdentifier" || e.type === "ChainExpression" && hu(e.expression) || e.type === "ParenthesizedExpression" && hu(e.expression);
}
ce.parseExprSubscripts = function(e, t) {
  var n = this.start, r = this.startLoc, i = this.parseExprAtom(e, t);
  if (i.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
    return i;
  var s = this.parseSubscripts(i, n, r, !1, t);
  return e && s.type === "MemberExpression" && (e.parenthesizedAssign >= s.start && (e.parenthesizedAssign = -1), e.parenthesizedBind >= s.start && (e.parenthesizedBind = -1), e.trailingComma >= s.start && (e.trailingComma = -1)), s;
};
ce.parseSubscripts = function(e, t, n, r, i) {
  for (var s = this.options.ecmaVersion >= 8 && e.type === "Identifier" && e.name === "async" && this.lastTokEnd === e.end && !this.canInsertSemicolon() && e.end - e.start === 5 && this.potentialArrowAt === e.start, u = !1; ; ) {
    var a = this.parseSubscript(e, t, n, r, s, u, i);
    if (a.optional && (u = !0), a === e || a.type === "ArrowFunctionExpression") {
      if (u) {
        var o = this.startNodeAt(t, n);
        o.expression = a, a = this.finishNode(o, "ChainExpression");
      }
      return a;
    }
    e = a;
  }
};
ce.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(b.arrow);
};
ce.parseSubscriptAsyncArrow = function(e, t, n, r) {
  return this.parseArrowExpression(this.startNodeAt(e, t), n, !0, r);
};
ce.parseSubscript = function(e, t, n, r, i, s, u) {
  var a = this.options.ecmaVersion >= 11, o = a && this.eat(b.questionDot);
  r && o && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  var f = this.eat(b.bracketL);
  if (f || o && this.type !== b.parenL && this.type !== b.backQuote || this.eat(b.dot)) {
    var h = this.startNodeAt(t, n);
    h.object = e, f ? (h.property = this.parseExpression(), this.expect(b.bracketR)) : this.type === b.privateId && e.type !== "Super" ? h.property = this.parsePrivateIdent() : h.property = this.parseIdent(this.options.allowReserved !== "never"), h.computed = !!f, a && (h.optional = o), e = this.finishNode(h, "MemberExpression");
  } else if (!r && this.eat(b.parenL)) {
    var m = new Yi(), p = this.yieldPos, A = this.awaitPos, M = this.awaitIdentPos;
    this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
    var v = this.parseExprList(b.parenR, this.options.ecmaVersion >= 8, !1, m);
    if (i && !o && this.shouldParseAsyncArrow())
      return this.checkPatternErrors(m, !1), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = p, this.awaitPos = A, this.awaitIdentPos = M, this.parseSubscriptAsyncArrow(t, n, v, u);
    this.checkExpressionErrors(m, !0), this.yieldPos = p || this.yieldPos, this.awaitPos = A || this.awaitPos, this.awaitIdentPos = M || this.awaitIdentPos;
    var E = this.startNodeAt(t, n);
    E.callee = e, E.arguments = v, a && (E.optional = o), e = this.finishNode(E, "CallExpression");
  } else if (this.type === b.backQuote) {
    (o || s) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    var k = this.startNodeAt(t, n);
    k.tag = e, k.quasi = this.parseTemplate({ isTagged: !0 }), e = this.finishNode(k, "TaggedTemplateExpression");
  }
  return e;
};
ce.parseExprAtom = function(e, t, n) {
  this.type === b.slash && this.readRegexp();
  var r, i = this.potentialArrowAt === this.start;
  switch (this.type) {
    case b._super:
      return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), r = this.startNode(), this.next(), this.type === b.parenL && !this.allowDirectSuper && this.raise(r.start, "super() call outside constructor of a subclass"), this.type !== b.dot && this.type !== b.bracketL && this.type !== b.parenL && this.unexpected(), this.finishNode(r, "Super");
    case b._this:
      return r = this.startNode(), this.next(), this.finishNode(r, "ThisExpression");
    case b.name:
      var s = this.start, u = this.startLoc, a = this.containsEsc, o = this.parseIdent(!1);
      if (this.options.ecmaVersion >= 8 && !a && o.name === "async" && !this.canInsertSemicolon() && this.eat(b._function))
        return this.overrideContext(Xe.f_expr), this.parseFunction(this.startNodeAt(s, u), 0, !1, !0, t);
      if (i && !this.canInsertSemicolon()) {
        if (this.eat(b.arrow))
          return this.parseArrowExpression(this.startNodeAt(s, u), [o], !1, t);
        if (this.options.ecmaVersion >= 8 && o.name === "async" && this.type === b.name && !a && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc))
          return o = this.parseIdent(!1), (this.canInsertSemicolon() || !this.eat(b.arrow)) && this.unexpected(), this.parseArrowExpression(this.startNodeAt(s, u), [o], !0, t);
      }
      return o;
    case b.regexp:
      var f = this.value;
      return r = this.parseLiteral(f.value), r.regex = { pattern: f.pattern, flags: f.flags }, r;
    case b.num:
    case b.string:
      return this.parseLiteral(this.value);
    case b._null:
    case b._true:
    case b._false:
      return r = this.startNode(), r.value = this.type === b._null ? null : this.type === b._true, r.raw = this.type.keyword, this.next(), this.finishNode(r, "Literal");
    case b.parenL:
      var h = this.start, m = this.parseParenAndDistinguishExpression(i, t);
      return e && (e.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(m) && (e.parenthesizedAssign = h), e.parenthesizedBind < 0 && (e.parenthesizedBind = h)), m;
    case b.bracketL:
      return r = this.startNode(), this.next(), r.elements = this.parseExprList(b.bracketR, !0, !0, e), this.finishNode(r, "ArrayExpression");
    case b.braceL:
      return this.overrideContext(Xe.b_expr), this.parseObj(!1, e);
    case b._function:
      return r = this.startNode(), this.next(), this.parseFunction(r, 0);
    case b._class:
      return this.parseClass(this.startNode(), !1);
    case b._new:
      return this.parseNew();
    case b.backQuote:
      return this.parseTemplate();
    case b._import:
      return this.options.ecmaVersion >= 11 ? this.parseExprImport(n) : this.unexpected();
    default:
      return this.parseExprAtomDefault();
  }
};
ce.parseExprAtomDefault = function() {
  this.unexpected();
};
ce.parseExprImport = function(e) {
  var t = this.startNode();
  if (this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import"), this.next(), this.type === b.parenL && !e)
    return this.parseDynamicImport(t);
  if (this.type === b.dot) {
    var n = this.startNodeAt(t.start, t.loc && t.loc.start);
    return n.name = "import", t.meta = this.finishNode(n, "Identifier"), this.parseImportMeta(t);
  } else
    this.unexpected();
};
ce.parseDynamicImport = function(e) {
  if (this.next(), e.source = this.parseMaybeAssign(), this.options.ecmaVersion >= 16)
    this.eat(b.parenR) ? e.options = null : (this.expect(b.comma), this.afterTrailingComma(b.parenR) ? e.options = null : (e.options = this.parseMaybeAssign(), this.eat(b.parenR) || (this.expect(b.comma), this.afterTrailingComma(b.parenR) || this.unexpected())));
  else if (!this.eat(b.parenR)) {
    var t = this.start;
    this.eat(b.comma) && this.eat(b.parenR) ? this.raiseRecoverable(t, "Trailing comma is not allowed in import()") : this.unexpected(t);
  }
  return this.finishNode(e, "ImportExpression");
};
ce.parseImportMeta = function(e) {
  this.next();
  var t = this.containsEsc;
  return e.property = this.parseIdent(!0), e.property.name !== "meta" && this.raiseRecoverable(e.property.start, "The only valid meta property for import is 'import.meta'"), t && this.raiseRecoverable(e.start, "'import.meta' must not contain escaped characters"), this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere && this.raiseRecoverable(e.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e, "MetaProperty");
};
ce.parseLiteral = function(e) {
  var t = this.startNode();
  return t.value = e, t.raw = this.input.slice(this.start, this.end), t.raw.charCodeAt(t.raw.length - 1) === 110 && (t.bigint = t.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(t, "Literal");
};
ce.parseParenExpression = function() {
  this.expect(b.parenL);
  var e = this.parseExpression();
  return this.expect(b.parenR), e;
};
ce.shouldParseArrow = function(e) {
  return !this.canInsertSemicolon();
};
ce.parseParenAndDistinguishExpression = function(e, t) {
  var n = this.start, r = this.startLoc, i, s = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var u = this.start, a = this.startLoc, o = [], f = !0, h = !1, m = new Yi(), p = this.yieldPos, A = this.awaitPos, M;
    for (this.yieldPos = 0, this.awaitPos = 0; this.type !== b.parenR; )
      if (f ? f = !1 : this.expect(b.comma), s && this.afterTrailingComma(b.parenR, !0)) {
        h = !0;
        break;
      } else if (this.type === b.ellipsis) {
        M = this.start, o.push(this.parseParenItem(this.parseRestBinding())), this.type === b.comma && this.raiseRecoverable(
          this.start,
          "Comma is not permitted after the rest element"
        );
        break;
      } else
        o.push(this.parseMaybeAssign(!1, m, this.parseParenItem));
    var v = this.lastTokEnd, E = this.lastTokEndLoc;
    if (this.expect(b.parenR), e && this.shouldParseArrow(o) && this.eat(b.arrow))
      return this.checkPatternErrors(m, !1), this.checkYieldAwaitInDefaultParams(), this.yieldPos = p, this.awaitPos = A, this.parseParenArrowList(n, r, o, t);
    (!o.length || h) && this.unexpected(this.lastTokStart), M && this.unexpected(M), this.checkExpressionErrors(m, !0), this.yieldPos = p || this.yieldPos, this.awaitPos = A || this.awaitPos, o.length > 1 ? (i = this.startNodeAt(u, a), i.expressions = o, this.finishNodeAt(i, "SequenceExpression", v, E)) : i = o[0];
  } else
    i = this.parseParenExpression();
  if (this.options.preserveParens) {
    var k = this.startNodeAt(n, r);
    return k.expression = i, this.finishNode(k, "ParenthesizedExpression");
  } else
    return i;
};
ce.parseParenItem = function(e) {
  return e;
};
ce.parseParenArrowList = function(e, t, n, r) {
  return this.parseArrowExpression(this.startNodeAt(e, t), n, !1, r);
};
var Cv = [];
ce.parseNew = function() {
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  var e = this.startNode();
  if (this.next(), this.options.ecmaVersion >= 6 && this.type === b.dot) {
    var t = this.startNodeAt(e.start, e.loc && e.loc.start);
    t.name = "new", e.meta = this.finishNode(t, "Identifier"), this.next();
    var n = this.containsEsc;
    return e.property = this.parseIdent(!0), e.property.name !== "target" && this.raiseRecoverable(e.property.start, "The only valid meta property for new is 'new.target'"), n && this.raiseRecoverable(e.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e, "MetaProperty");
  }
  var r = this.start, i = this.startLoc;
  return e.callee = this.parseSubscripts(this.parseExprAtom(null, !1, !0), r, i, !0, !1), this.eat(b.parenL) ? e.arguments = this.parseExprList(b.parenR, this.options.ecmaVersion >= 8, !1) : e.arguments = Cv, this.finishNode(e, "NewExpression");
};
ce.parseTemplateElement = function(e) {
  var t = e.isTagged, n = this.startNode();
  return this.type === b.invalidTemplate ? (t || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), n.value = {
    raw: this.value.replace(/\r\n?/g, `
`),
    cooked: null
  }) : n.value = {
    raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, `
`),
    cooked: this.value
  }, this.next(), n.tail = this.type === b.backQuote, this.finishNode(n, "TemplateElement");
};
ce.parseTemplate = function(e) {
  e === void 0 && (e = {});
  var t = e.isTagged;
  t === void 0 && (t = !1);
  var n = this.startNode();
  this.next(), n.expressions = [];
  var r = this.parseTemplateElement({ isTagged: t });
  for (n.quasis = [r]; !r.tail; )
    this.type === b.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(b.dollarBraceL), n.expressions.push(this.parseExpression()), this.expect(b.braceR), n.quasis.push(r = this.parseTemplateElement({ isTagged: t }));
  return this.next(), this.finishNode(n, "TemplateLiteral");
};
ce.isAsyncProp = function(e) {
  return !e.computed && e.key.type === "Identifier" && e.key.name === "async" && (this.type === b.name || this.type === b.num || this.type === b.string || this.type === b.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === b.star) && !kt.test(this.input.slice(this.lastTokEnd, this.start));
};
ce.parseObj = function(e, t) {
  var n = this.startNode(), r = !0, i = {};
  for (n.properties = [], this.next(); !this.eat(b.braceR); ) {
    if (r)
      r = !1;
    else if (this.expect(b.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(b.braceR))
      break;
    var s = this.parseProperty(e, t);
    e || this.checkPropClash(s, i, t), n.properties.push(s);
  }
  return this.finishNode(n, e ? "ObjectPattern" : "ObjectExpression");
};
ce.parseProperty = function(e, t) {
  var n = this.startNode(), r, i, s, u;
  if (this.options.ecmaVersion >= 9 && this.eat(b.ellipsis))
    return e ? (n.argument = this.parseIdent(!1), this.type === b.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.finishNode(n, "RestElement")) : (n.argument = this.parseMaybeAssign(!1, t), this.type === b.comma && t && t.trailingComma < 0 && (t.trailingComma = this.start), this.finishNode(n, "SpreadElement"));
  this.options.ecmaVersion >= 6 && (n.method = !1, n.shorthand = !1, (e || t) && (s = this.start, u = this.startLoc), e || (r = this.eat(b.star)));
  var a = this.containsEsc;
  return this.parsePropertyName(n), !e && !a && this.options.ecmaVersion >= 8 && !r && this.isAsyncProp(n) ? (i = !0, r = this.options.ecmaVersion >= 9 && this.eat(b.star), this.parsePropertyName(n)) : i = !1, this.parsePropertyValue(n, e, r, i, s, u, t, a), this.finishNode(n, "Property");
};
ce.parseGetterSetter = function(e) {
  e.kind = e.key.name, this.parsePropertyName(e), e.value = this.parseMethod(!1);
  var t = e.kind === "get" ? 0 : 1;
  if (e.value.params.length !== t) {
    var n = e.value.start;
    e.kind === "get" ? this.raiseRecoverable(n, "getter should have no params") : this.raiseRecoverable(n, "setter should have exactly one param");
  } else
    e.kind === "set" && e.value.params[0].type === "RestElement" && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params");
};
ce.parsePropertyValue = function(e, t, n, r, i, s, u, a) {
  (n || r) && this.type === b.colon && this.unexpected(), this.eat(b.colon) ? (e.value = t ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(!1, u), e.kind = "init") : this.options.ecmaVersion >= 6 && this.type === b.parenL ? (t && this.unexpected(), e.kind = "init", e.method = !0, e.value = this.parseMethod(n, r)) : !t && !a && this.options.ecmaVersion >= 5 && !e.computed && e.key.type === "Identifier" && (e.key.name === "get" || e.key.name === "set") && this.type !== b.comma && this.type !== b.braceR && this.type !== b.eq ? ((n || r) && this.unexpected(), this.parseGetterSetter(e)) : this.options.ecmaVersion >= 6 && !e.computed && e.key.type === "Identifier" ? ((n || r) && this.unexpected(), this.checkUnreserved(e.key), e.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = i), e.kind = "init", t ? e.value = this.parseMaybeDefault(i, s, this.copyNode(e.key)) : this.type === b.eq && u ? (u.shorthandAssign < 0 && (u.shorthandAssign = this.start), e.value = this.parseMaybeDefault(i, s, this.copyNode(e.key))) : e.value = this.copyNode(e.key), e.shorthand = !0) : this.unexpected();
};
ce.parsePropertyName = function(e) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(b.bracketL))
      return e.computed = !0, e.key = this.parseMaybeAssign(), this.expect(b.bracketR), e.key;
    e.computed = !1;
  }
  return e.key = this.type === b.num || this.type === b.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
ce.initFunction = function(e) {
  e.id = null, this.options.ecmaVersion >= 6 && (e.generator = e.expression = !1), this.options.ecmaVersion >= 8 && (e.async = !1);
};
ce.parseMethod = function(e, t, n) {
  var r = this.startNode(), i = this.yieldPos, s = this.awaitPos, u = this.awaitIdentPos;
  return this.initFunction(r), this.options.ecmaVersion >= 6 && (r.generator = e), this.options.ecmaVersion >= 8 && (r.async = !!t), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(oa(t, r.generator) | ua | (n ? Hd : 0)), this.expect(b.parenL), r.params = this.parseBindingList(b.parenR, !1, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(r, !1, !0, !1), this.yieldPos = i, this.awaitPos = s, this.awaitIdentPos = u, this.finishNode(r, "FunctionExpression");
};
ce.parseArrowExpression = function(e, t, n, r) {
  var i = this.yieldPos, s = this.awaitPos, u = this.awaitIdentPos;
  return this.enterScope(oa(n, !1) | qd), this.initFunction(e), this.options.ecmaVersion >= 8 && (e.async = !!n), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e.params = this.toAssignableList(t, !0), this.parseFunctionBody(e, !0, !1, r), this.yieldPos = i, this.awaitPos = s, this.awaitIdentPos = u, this.finishNode(e, "ArrowFunctionExpression");
};
ce.parseFunctionBody = function(e, t, n, r) {
  var i = t && this.type !== b.braceL, s = this.strict, u = !1;
  if (i)
    e.body = this.parseMaybeAssign(r), e.expression = !0, this.checkParams(e, !1);
  else {
    var a = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e.params);
    (!s || a) && (u = this.strictDirective(this.end), u && a && this.raiseRecoverable(e.start, "Illegal 'use strict' directive in function with non-simple parameter list"));
    var o = this.labels;
    this.labels = [], u && (this.strict = !0), this.checkParams(e, !s && !u && !t && !n && this.isSimpleParamList(e.params)), this.strict && e.id && this.checkLValSimple(e.id, Ud), e.body = this.parseBlock(!1, void 0, u && !s), e.expression = !1, this.adaptDirectivePrologue(e.body.body), this.labels = o;
  }
  this.exitScope();
};
ce.isSimpleParamList = function(e) {
  for (var t = 0, n = e; t < n.length; t += 1) {
    var r = n[t];
    if (r.type !== "Identifier")
      return !1;
  }
  return !0;
};
ce.checkParams = function(e, t) {
  for (var n = /* @__PURE__ */ Object.create(null), r = 0, i = e.params; r < i.length; r += 1) {
    var s = i[r];
    this.checkLValInnerPattern(s, ca, t ? null : n);
  }
};
ce.parseExprList = function(e, t, n, r) {
  for (var i = [], s = !0; !this.eat(e); ) {
    if (s)
      s = !1;
    else if (this.expect(b.comma), t && this.afterTrailingComma(e))
      break;
    var u = void 0;
    n && this.type === b.comma ? u = null : this.type === b.ellipsis ? (u = this.parseSpread(r), r && this.type === b.comma && r.trailingComma < 0 && (r.trailingComma = this.start)) : u = this.parseMaybeAssign(!1, r), i.push(u);
  }
  return i;
};
ce.checkUnreserved = function(e) {
  var t = e.start, n = e.end, r = e.name;
  if (this.inGenerator && r === "yield" && this.raiseRecoverable(t, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && r === "await" && this.raiseRecoverable(t, "Cannot use 'await' as identifier inside an async function"), this.currentThisScope().inClassFieldInit && r === "arguments" && this.raiseRecoverable(t, "Cannot use 'arguments' in class field initializer"), this.inClassStaticBlock && (r === "arguments" || r === "await") && this.raise(t, "Cannot use " + r + " in class static initialization block"), this.keywords.test(r) && this.raise(t, "Unexpected keyword '" + r + "'"), !(this.options.ecmaVersion < 6 && this.input.slice(t, n).indexOf("\\") !== -1)) {
    var i = this.strict ? this.reservedWordsStrict : this.reservedWords;
    i.test(r) && (!this.inAsync && r === "await" && this.raiseRecoverable(t, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t, "The keyword '" + r + "' is reserved"));
  }
};
ce.parseIdent = function(e) {
  var t = this.parseIdentNode();
  return this.next(!!e), this.finishNode(t, "Identifier"), e || (this.checkUnreserved(t), t.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = t.start)), t;
};
ce.parseIdentNode = function() {
  var e = this.startNode();
  return this.type === b.name ? e.name = this.value : this.type.keyword ? (e.name = this.type.keyword, (e.name === "class" || e.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46) && this.context.pop(), this.type = b.name) : this.unexpected(), e;
};
ce.parsePrivateIdent = function() {
  var e = this.startNode();
  return this.type === b.privateId ? e.name = this.value : this.unexpected(), this.next(), this.finishNode(e, "PrivateIdentifier"), this.options.checkPrivateFields && (this.privateNameStack.length === 0 ? this.raise(e.start, "Private field '#" + e.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e)), e;
};
ce.parseYield = function(e) {
  this.yieldPos || (this.yieldPos = this.start);
  var t = this.startNode();
  return this.next(), this.type === b.semi || this.canInsertSemicolon() || this.type !== b.star && !this.type.startsExpr ? (t.delegate = !1, t.argument = null) : (t.delegate = this.eat(b.star), t.argument = this.parseMaybeAssign(e)), this.finishNode(t, "YieldExpression");
};
ce.parseAwait = function(e) {
  this.awaitPos || (this.awaitPos = this.start);
  var t = this.startNode();
  return this.next(), t.argument = this.parseMaybeUnary(null, !0, !1, e), this.finishNode(t, "AwaitExpression");
};
var Li = Ue.prototype;
Li.raise = function(e, t) {
  var n = jd(this.input, e);
  t += " (" + n.line + ":" + n.column + ")";
  var r = new SyntaxError(t);
  throw r.pos = e, r.loc = n, r.raisedAt = this.pos, r;
};
Li.raiseRecoverable = Li.raise;
Li.curPosition = function() {
  if (this.options.locations)
    return new Qr(this.curLine, this.pos - this.lineStart);
};
var Xn = Ue.prototype, vv = function(t) {
  this.flags = t, this.var = [], this.lexical = [], this.functions = [], this.inClassFieldInit = !1;
};
Xn.enterScope = function(e) {
  this.scopeStack.push(new vv(e));
};
Xn.exitScope = function() {
  this.scopeStack.pop();
};
Xn.treatFunctionsAsVarInScope = function(e) {
  return e.flags & Dr || !this.inModule && e.flags & ei;
};
Xn.declareName = function(e, t, n) {
  var r = !1;
  if (t === Fn) {
    var i = this.currentScope();
    r = i.lexical.indexOf(e) > -1 || i.functions.indexOf(e) > -1 || i.var.indexOf(e) > -1, i.lexical.push(e), this.inModule && i.flags & ei && delete this.undefinedExports[e];
  } else if (t === Yd) {
    var s = this.currentScope();
    s.lexical.push(e);
  } else if (t === Jd) {
    var u = this.currentScope();
    this.treatFunctionsAsVar ? r = u.lexical.indexOf(e) > -1 : r = u.lexical.indexOf(e) > -1 || u.var.indexOf(e) > -1, u.functions.push(e);
  } else
    for (var a = this.scopeStack.length - 1; a >= 0; --a) {
      var o = this.scopeStack[a];
      if (o.lexical.indexOf(e) > -1 && !(o.flags & Kd && o.lexical[0] === e) || !this.treatFunctionsAsVarInScope(o) && o.functions.indexOf(e) > -1) {
        r = !0;
        break;
      }
      if (o.var.push(e), this.inModule && o.flags & ei && delete this.undefinedExports[e], o.flags & aa)
        break;
    }
  r && this.raiseRecoverable(n, "Identifier '" + e + "' has already been declared");
};
Xn.checkLocalExport = function(e) {
  this.scopeStack[0].lexical.indexOf(e.name) === -1 && this.scopeStack[0].var.indexOf(e.name) === -1 && (this.undefinedExports[e.name] = e);
};
Xn.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
Xn.currentVarScope = function() {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var t = this.scopeStack[e];
    if (t.flags & aa)
      return t;
  }
};
Xn.currentThisScope = function() {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var t = this.scopeStack[e];
    if (t.flags & aa && !(t.flags & qd))
      return t;
  }
};
var Ui = function(t, n, r) {
  this.type = "", this.start = n, this.end = 0, t.options.locations && (this.loc = new Ji(t, r)), t.options.directSourceFile && (this.sourceFile = t.options.directSourceFile), t.options.ranges && (this.range = [n, 0]);
}, si = Ue.prototype;
si.startNode = function() {
  return new Ui(this, this.start, this.startLoc);
};
si.startNodeAt = function(e, t) {
  return new Ui(this, e, t);
};
function tm(e, t, n, r) {
  return e.type = t, e.end = n, this.options.locations && (e.loc.end = r), this.options.ranges && (e.range[1] = n), e;
}
si.finishNode = function(e, t) {
  return tm.call(this, e, t, this.lastTokEnd, this.lastTokEndLoc);
};
si.finishNodeAt = function(e, t, n, r) {
  return tm.call(this, e, t, n, r);
};
si.copyNode = function(e) {
  var t = new Ui(this, e.start, this.startLoc);
  for (var n in e)
    t[n] = e[n];
  return t;
};
var Pv = "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz", nm = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", rm = nm + " Extended_Pictographic", im = rm, sm = im + " EBase EComp EMod EPres ExtPict", um = sm, Dv = um, Fv = {
  9: nm,
  10: rm,
  11: im,
  12: sm,
  13: um,
  14: Dv
}, Ev = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji", xv = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: Ev
}, bo = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", am = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", om = am + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", cm = om + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", lm = cm + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", fm = lm + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", wv = fm + " " + Pv, Sv = {
  9: am,
  10: om,
  11: cm,
  12: lm,
  13: fm,
  14: wv
}, hm = {};
function Bv(e) {
  var t = hm[e] = {
    binary: Vn(Fv[e] + " " + bo),
    binaryOfStrings: Vn(xv[e]),
    nonBinary: {
      General_Category: Vn(bo),
      Script: Vn(Sv[e])
    }
  };
  t.nonBinary.Script_Extensions = t.nonBinary.Script, t.nonBinary.gc = t.nonBinary.General_Category, t.nonBinary.sc = t.nonBinary.Script, t.nonBinary.scx = t.nonBinary.Script_Extensions;
}
for (var ks = 0, Ao = [9, 10, 11, 12, 13, 14]; ks < Ao.length; ks += 1) {
  var _v = Ao[ks];
  Bv(_v);
}
var Y = Ue.prototype, Ri = function(t, n) {
  this.parent = t, this.base = n || this;
};
Ri.prototype.separatedFrom = function(t) {
  for (var n = this; n; n = n.parent)
    for (var r = t; r; r = r.parent)
      if (n.base === r.base && n !== r)
        return !0;
  return !1;
};
Ri.prototype.sibling = function() {
  return new Ri(this.parent, this.base);
};
var on = function(t) {
  this.parser = t, this.validFlags = "gim" + (t.options.ecmaVersion >= 6 ? "uy" : "") + (t.options.ecmaVersion >= 9 ? "s" : "") + (t.options.ecmaVersion >= 13 ? "d" : "") + (t.options.ecmaVersion >= 15 ? "v" : ""), this.unicodeProperties = hm[t.options.ecmaVersion >= 14 ? 14 : t.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = !1, this.switchV = !1, this.switchN = !1, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = !1, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = /* @__PURE__ */ Object.create(null), this.backReferenceNames = [], this.branchID = null;
};
on.prototype.reset = function(t, n, r) {
  var i = r.indexOf("v") !== -1, s = r.indexOf("u") !== -1;
  this.start = t | 0, this.source = n + "", this.flags = r, i && this.parser.options.ecmaVersion >= 15 ? (this.switchU = !0, this.switchV = !0, this.switchN = !0) : (this.switchU = s && this.parser.options.ecmaVersion >= 6, this.switchV = !1, this.switchN = s && this.parser.options.ecmaVersion >= 9);
};
on.prototype.raise = function(t) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + t);
};
on.prototype.at = function(t, n) {
  n === void 0 && (n = !1);
  var r = this.source, i = r.length;
  if (t >= i)
    return -1;
  var s = r.charCodeAt(t);
  if (!(n || this.switchU) || s <= 55295 || s >= 57344 || t + 1 >= i)
    return s;
  var u = r.charCodeAt(t + 1);
  return u >= 56320 && u <= 57343 ? (s << 10) + u - 56613888 : s;
};
on.prototype.nextIndex = function(t, n) {
  n === void 0 && (n = !1);
  var r = this.source, i = r.length;
  if (t >= i)
    return i;
  var s = r.charCodeAt(t), u;
  return !(n || this.switchU) || s <= 55295 || s >= 57344 || t + 1 >= i || (u = r.charCodeAt(t + 1)) < 56320 || u > 57343 ? t + 1 : t + 2;
};
on.prototype.current = function(t) {
  return t === void 0 && (t = !1), this.at(this.pos, t);
};
on.prototype.lookahead = function(t) {
  return t === void 0 && (t = !1), this.at(this.nextIndex(this.pos, t), t);
};
on.prototype.advance = function(t) {
  t === void 0 && (t = !1), this.pos = this.nextIndex(this.pos, t);
};
on.prototype.eat = function(t, n) {
  return n === void 0 && (n = !1), this.current(n) === t ? (this.advance(n), !0) : !1;
};
on.prototype.eatChars = function(t, n) {
  n === void 0 && (n = !1);
  for (var r = this.pos, i = 0, s = t; i < s.length; i += 1) {
    var u = s[i], a = this.at(r, n);
    if (a === -1 || a !== u)
      return !1;
    r = this.nextIndex(r, n);
  }
  return this.pos = r, !0;
};
Y.validateRegExpFlags = function(e) {
  for (var t = e.validFlags, n = e.flags, r = !1, i = !1, s = 0; s < n.length; s++) {
    var u = n.charAt(s);
    t.indexOf(u) === -1 && this.raise(e.start, "Invalid regular expression flag"), n.indexOf(u, s + 1) > -1 && this.raise(e.start, "Duplicate regular expression flag"), u === "u" && (r = !0), u === "v" && (i = !0);
  }
  this.options.ecmaVersion >= 15 && r && i && this.raise(e.start, "Invalid regular expression flag");
};
function kv(e) {
  for (var t in e)
    return !0;
  return !1;
}
Y.validateRegExpPattern = function(e) {
  this.regexp_pattern(e), !e.switchN && this.options.ecmaVersion >= 9 && kv(e.groupNames) && (e.switchN = !0, this.regexp_pattern(e));
};
Y.regexp_pattern = function(e) {
  e.pos = 0, e.lastIntValue = 0, e.lastStringValue = "", e.lastAssertionIsQuantifiable = !1, e.numCapturingParens = 0, e.maxBackReference = 0, e.groupNames = /* @__PURE__ */ Object.create(null), e.backReferenceNames.length = 0, e.branchID = null, this.regexp_disjunction(e), e.pos !== e.source.length && (e.eat(
    41
    /* ) */
  ) && e.raise("Unmatched ')'"), (e.eat(
    93
    /* ] */
  ) || e.eat(
    125
    /* } */
  )) && e.raise("Lone quantifier brackets")), e.maxBackReference > e.numCapturingParens && e.raise("Invalid escape");
  for (var t = 0, n = e.backReferenceNames; t < n.length; t += 1) {
    var r = n[t];
    e.groupNames[r] || e.raise("Invalid named capture referenced");
  }
};
Y.regexp_disjunction = function(e) {
  var t = this.options.ecmaVersion >= 16;
  for (t && (e.branchID = new Ri(e.branchID, null)), this.regexp_alternative(e); e.eat(
    124
    /* | */
  ); )
    t && (e.branchID = e.branchID.sibling()), this.regexp_alternative(e);
  t && (e.branchID = e.branchID.parent), this.regexp_eatQuantifier(e, !0) && e.raise("Nothing to repeat"), e.eat(
    123
    /* { */
  ) && e.raise("Lone quantifier brackets");
};
Y.regexp_alternative = function(e) {
  for (; e.pos < e.source.length && this.regexp_eatTerm(e); )
    ;
};
Y.regexp_eatTerm = function(e) {
  return this.regexp_eatAssertion(e) ? (e.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e) && e.switchU && e.raise("Invalid quantifier"), !0) : (e.switchU ? this.regexp_eatAtom(e) : this.regexp_eatExtendedAtom(e)) ? (this.regexp_eatQuantifier(e), !0) : !1;
};
Y.regexp_eatAssertion = function(e) {
  var t = e.pos;
  if (e.lastAssertionIsQuantifiable = !1, e.eat(
    94
    /* ^ */
  ) || e.eat(
    36
    /* $ */
  ))
    return !0;
  if (e.eat(
    92
    /* \ */
  )) {
    if (e.eat(
      66
      /* B */
    ) || e.eat(
      98
      /* b */
    ))
      return !0;
    e.pos = t;
  }
  if (e.eat(
    40
    /* ( */
  ) && e.eat(
    63
    /* ? */
  )) {
    var n = !1;
    if (this.options.ecmaVersion >= 9 && (n = e.eat(
      60
      /* < */
    )), e.eat(
      61
      /* = */
    ) || e.eat(
      33
      /* ! */
    ))
      return this.regexp_disjunction(e), e.eat(
        41
        /* ) */
      ) || e.raise("Unterminated group"), e.lastAssertionIsQuantifiable = !n, !0;
  }
  return e.pos = t, !1;
};
Y.regexp_eatQuantifier = function(e, t) {
  return t === void 0 && (t = !1), this.regexp_eatQuantifierPrefix(e, t) ? (e.eat(
    63
    /* ? */
  ), !0) : !1;
};
Y.regexp_eatQuantifierPrefix = function(e, t) {
  return e.eat(
    42
    /* * */
  ) || e.eat(
    43
    /* + */
  ) || e.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(e, t);
};
Y.regexp_eatBracedQuantifier = function(e, t) {
  var n = e.pos;
  if (e.eat(
    123
    /* { */
  )) {
    var r = 0, i = -1;
    if (this.regexp_eatDecimalDigits(e) && (r = e.lastIntValue, e.eat(
      44
      /* , */
    ) && this.regexp_eatDecimalDigits(e) && (i = e.lastIntValue), e.eat(
      125
      /* } */
    )))
      return i !== -1 && i < r && !t && e.raise("numbers out of order in {} quantifier"), !0;
    e.switchU && !t && e.raise("Incomplete quantifier"), e.pos = n;
  }
  return !1;
};
Y.regexp_eatAtom = function(e) {
  return this.regexp_eatPatternCharacters(e) || e.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e);
};
Y.regexp_eatReverseSolidusAtomEscape = function(e) {
  var t = e.pos;
  if (e.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(e))
      return !0;
    e.pos = t;
  }
  return !1;
};
Y.regexp_eatUncapturingGroup = function(e) {
  var t = e.pos;
  if (e.eat(
    40
    /* ( */
  )) {
    if (e.eat(
      63
      /* ? */
    )) {
      if (this.options.ecmaVersion >= 16) {
        var n = this.regexp_eatModifiers(e), r = e.eat(
          45
          /* - */
        );
        if (n || r) {
          for (var i = 0; i < n.length; i++) {
            var s = n.charAt(i);
            n.indexOf(s, i + 1) > -1 && e.raise("Duplicate regular expression modifiers");
          }
          if (r) {
            var u = this.regexp_eatModifiers(e);
            !n && !u && e.current() === 58 && e.raise("Invalid regular expression modifiers");
            for (var a = 0; a < u.length; a++) {
              var o = u.charAt(a);
              (u.indexOf(o, a + 1) > -1 || n.indexOf(o) > -1) && e.raise("Duplicate regular expression modifiers");
            }
          }
        }
      }
      if (e.eat(
        58
        /* : */
      )) {
        if (this.regexp_disjunction(e), e.eat(
          41
          /* ) */
        ))
          return !0;
        e.raise("Unterminated group");
      }
    }
    e.pos = t;
  }
  return !1;
};
Y.regexp_eatCapturingGroup = function(e) {
  if (e.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e) : e.current() === 63 && e.raise("Invalid group"), this.regexp_disjunction(e), e.eat(
      41
      /* ) */
    ))
      return e.numCapturingParens += 1, !0;
    e.raise("Unterminated group");
  }
  return !1;
};
Y.regexp_eatModifiers = function(e) {
  for (var t = "", n = 0; (n = e.current()) !== -1 && Iv(n); )
    t += Pn(n), e.advance();
  return t;
};
function Iv(e) {
  return e === 105 || e === 109 || e === 115;
}
Y.regexp_eatExtendedAtom = function(e) {
  return e.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e) || this.regexp_eatInvalidBracedQuantifier(e) || this.regexp_eatExtendedPatternCharacter(e);
};
Y.regexp_eatInvalidBracedQuantifier = function(e) {
  return this.regexp_eatBracedQuantifier(e, !0) && e.raise("Nothing to repeat"), !1;
};
Y.regexp_eatSyntaxCharacter = function(e) {
  var t = e.current();
  return pm(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function pm(e) {
  return e === 36 || e >= 40 && e <= 43 || e === 46 || e === 63 || e >= 91 && e <= 94 || e >= 123 && e <= 125;
}
Y.regexp_eatPatternCharacters = function(e) {
  for (var t = e.pos, n = 0; (n = e.current()) !== -1 && !pm(n); )
    e.advance();
  return e.pos !== t;
};
Y.regexp_eatExtendedPatternCharacter = function(e) {
  var t = e.current();
  return t !== -1 && t !== 36 && !(t >= 40 && t <= 43) && t !== 46 && t !== 63 && t !== 91 && t !== 94 && t !== 124 ? (e.advance(), !0) : !1;
};
Y.regexp_groupSpecifier = function(e) {
  if (e.eat(
    63
    /* ? */
  )) {
    this.regexp_eatGroupName(e) || e.raise("Invalid group");
    var t = this.options.ecmaVersion >= 16, n = e.groupNames[e.lastStringValue];
    if (n)
      if (t)
        for (var r = 0, i = n; r < i.length; r += 1) {
          var s = i[r];
          s.separatedFrom(e.branchID) || e.raise("Duplicate capture group name");
        }
      else
        e.raise("Duplicate capture group name");
    t ? (n || (e.groupNames[e.lastStringValue] = [])).push(e.branchID) : e.groupNames[e.lastStringValue] = !0;
  }
};
Y.regexp_eatGroupName = function(e) {
  if (e.lastStringValue = "", e.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(e) && e.eat(
      62
      /* > */
    ))
      return !0;
    e.raise("Invalid capture group name");
  }
  return !1;
};
Y.regexp_eatRegExpIdentifierName = function(e) {
  if (e.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e)) {
    for (e.lastStringValue += Pn(e.lastIntValue); this.regexp_eatRegExpIdentifierPart(e); )
      e.lastStringValue += Pn(e.lastIntValue);
    return !0;
  }
  return !1;
};
Y.regexp_eatRegExpIdentifierStart = function(e) {
  var t = e.pos, n = this.options.ecmaVersion >= 11, r = e.current(n);
  return e.advance(n), r === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, n) && (r = e.lastIntValue), Vv(r) ? (e.lastIntValue = r, !0) : (e.pos = t, !1);
};
function Vv(e) {
  return vn(e, !0) || e === 36 || e === 95;
}
Y.regexp_eatRegExpIdentifierPart = function(e) {
  var t = e.pos, n = this.options.ecmaVersion >= 11, r = e.current(n);
  return e.advance(n), r === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, n) && (r = e.lastIntValue), Nv(r) ? (e.lastIntValue = r, !0) : (e.pos = t, !1);
};
function Nv(e) {
  return mr(e, !0) || e === 36 || e === 95 || e === 8204 || e === 8205;
}
Y.regexp_eatAtomEscape = function(e) {
  return this.regexp_eatBackReference(e) || this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e) || e.switchN && this.regexp_eatKGroupName(e) ? !0 : (e.switchU && (e.current() === 99 && e.raise("Invalid unicode escape"), e.raise("Invalid escape")), !1);
};
Y.regexp_eatBackReference = function(e) {
  var t = e.pos;
  if (this.regexp_eatDecimalEscape(e)) {
    var n = e.lastIntValue;
    if (e.switchU)
      return n > e.maxBackReference && (e.maxBackReference = n), !0;
    if (n <= e.numCapturingParens)
      return !0;
    e.pos = t;
  }
  return !1;
};
Y.regexp_eatKGroupName = function(e) {
  if (e.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(e))
      return e.backReferenceNames.push(e.lastStringValue), !0;
    e.raise("Invalid named reference");
  }
  return !1;
};
Y.regexp_eatCharacterEscape = function(e) {
  return this.regexp_eatControlEscape(e) || this.regexp_eatCControlLetter(e) || this.regexp_eatZero(e) || this.regexp_eatHexEscapeSequence(e) || this.regexp_eatRegExpUnicodeEscapeSequence(e, !1) || !e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e) || this.regexp_eatIdentityEscape(e);
};
Y.regexp_eatCControlLetter = function(e) {
  var t = e.pos;
  if (e.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(e))
      return !0;
    e.pos = t;
  }
  return !1;
};
Y.regexp_eatZero = function(e) {
  return e.current() === 48 && !Qi(e.lookahead()) ? (e.lastIntValue = 0, e.advance(), !0) : !1;
};
Y.regexp_eatControlEscape = function(e) {
  var t = e.current();
  return t === 116 ? (e.lastIntValue = 9, e.advance(), !0) : t === 110 ? (e.lastIntValue = 10, e.advance(), !0) : t === 118 ? (e.lastIntValue = 11, e.advance(), !0) : t === 102 ? (e.lastIntValue = 12, e.advance(), !0) : t === 114 ? (e.lastIntValue = 13, e.advance(), !0) : !1;
};
Y.regexp_eatControlLetter = function(e) {
  var t = e.current();
  return dm(t) ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
};
function dm(e) {
  return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
Y.regexp_eatRegExpUnicodeEscapeSequence = function(e, t) {
  t === void 0 && (t = !1);
  var n = e.pos, r = t || e.switchU;
  if (e.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(e, 4)) {
      var i = e.lastIntValue;
      if (r && i >= 55296 && i <= 56319) {
        var s = e.pos;
        if (e.eat(
          92
          /* \ */
        ) && e.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(e, 4)) {
          var u = e.lastIntValue;
          if (u >= 56320 && u <= 57343)
            return e.lastIntValue = (i - 55296) * 1024 + (u - 56320) + 65536, !0;
        }
        e.pos = s, e.lastIntValue = i;
      }
      return !0;
    }
    if (r && e.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(e) && e.eat(
      125
      /* } */
    ) && Tv(e.lastIntValue))
      return !0;
    r && e.raise("Invalid unicode escape"), e.pos = n;
  }
  return !1;
};
function Tv(e) {
  return e >= 0 && e <= 1114111;
}
Y.regexp_eatIdentityEscape = function(e) {
  if (e.switchU)
    return this.regexp_eatSyntaxCharacter(e) ? !0 : e.eat(
      47
      /* / */
    ) ? (e.lastIntValue = 47, !0) : !1;
  var t = e.current();
  return t !== 99 && (!e.switchN || t !== 107) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
Y.regexp_eatDecimalEscape = function(e) {
  e.lastIntValue = 0;
  var t = e.current();
  if (t >= 49 && t <= 57) {
    do
      e.lastIntValue = 10 * e.lastIntValue + (t - 48), e.advance();
    while ((t = e.current()) >= 48 && t <= 57);
    return !0;
  }
  return !1;
};
var mm = 0, Dn = 1, wt = 2;
Y.regexp_eatCharacterClassEscape = function(e) {
  var t = e.current();
  if (Lv(t))
    return e.lastIntValue = -1, e.advance(), Dn;
  var n = !1;
  if (e.switchU && this.options.ecmaVersion >= 9 && ((n = t === 80) || t === 112)) {
    e.lastIntValue = -1, e.advance();
    var r;
    if (e.eat(
      123
      /* { */
    ) && (r = this.regexp_eatUnicodePropertyValueExpression(e)) && e.eat(
      125
      /* } */
    ))
      return n && r === wt && e.raise("Invalid property name"), r;
    e.raise("Invalid property name");
  }
  return mm;
};
function Lv(e) {
  return e === 100 || e === 68 || e === 115 || e === 83 || e === 119 || e === 87;
}
Y.regexp_eatUnicodePropertyValueExpression = function(e) {
  var t = e.pos;
  if (this.regexp_eatUnicodePropertyName(e) && e.eat(
    61
    /* = */
  )) {
    var n = e.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(e)) {
      var r = e.lastStringValue;
      return this.regexp_validateUnicodePropertyNameAndValue(e, n, r), Dn;
    }
  }
  if (e.pos = t, this.regexp_eatLoneUnicodePropertyNameOrValue(e)) {
    var i = e.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(e, i);
  }
  return mm;
};
Y.regexp_validateUnicodePropertyNameAndValue = function(e, t, n) {
  Pr(e.unicodeProperties.nonBinary, t) || e.raise("Invalid property name"), e.unicodeProperties.nonBinary[t].test(n) || e.raise("Invalid property value");
};
Y.regexp_validateUnicodePropertyNameOrValue = function(e, t) {
  if (e.unicodeProperties.binary.test(t))
    return Dn;
  if (e.switchV && e.unicodeProperties.binaryOfStrings.test(t))
    return wt;
  e.raise("Invalid property name");
};
Y.regexp_eatUnicodePropertyName = function(e) {
  var t = 0;
  for (e.lastStringValue = ""; gm(t = e.current()); )
    e.lastStringValue += Pn(t), e.advance();
  return e.lastStringValue !== "";
};
function gm(e) {
  return dm(e) || e === 95;
}
Y.regexp_eatUnicodePropertyValue = function(e) {
  var t = 0;
  for (e.lastStringValue = ""; Rv(t = e.current()); )
    e.lastStringValue += Pn(t), e.advance();
  return e.lastStringValue !== "";
};
function Rv(e) {
  return gm(e) || Qi(e);
}
Y.regexp_eatLoneUnicodePropertyNameOrValue = function(e) {
  return this.regexp_eatUnicodePropertyValue(e);
};
Y.regexp_eatCharacterClass = function(e) {
  if (e.eat(
    91
    /* [ */
  )) {
    var t = e.eat(
      94
      /* ^ */
    ), n = this.regexp_classContents(e);
    return e.eat(
      93
      /* ] */
    ) || e.raise("Unterminated character class"), t && n === wt && e.raise("Negated character class may contain strings"), !0;
  }
  return !1;
};
Y.regexp_classContents = function(e) {
  return e.current() === 93 ? Dn : e.switchV ? this.regexp_classSetExpression(e) : (this.regexp_nonEmptyClassRanges(e), Dn);
};
Y.regexp_nonEmptyClassRanges = function(e) {
  for (; this.regexp_eatClassAtom(e); ) {
    var t = e.lastIntValue;
    if (e.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(e)) {
      var n = e.lastIntValue;
      e.switchU && (t === -1 || n === -1) && e.raise("Invalid character class"), t !== -1 && n !== -1 && t > n && e.raise("Range out of order in character class");
    }
  }
};
Y.regexp_eatClassAtom = function(e) {
  var t = e.pos;
  if (e.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(e))
      return !0;
    if (e.switchU) {
      var n = e.current();
      (n === 99 || Am(n)) && e.raise("Invalid class escape"), e.raise("Invalid escape");
    }
    e.pos = t;
  }
  var r = e.current();
  return r !== 93 ? (e.lastIntValue = r, e.advance(), !0) : !1;
};
Y.regexp_eatClassEscape = function(e) {
  var t = e.pos;
  if (e.eat(
    98
    /* b */
  ))
    return e.lastIntValue = 8, !0;
  if (e.switchU && e.eat(
    45
    /* - */
  ))
    return e.lastIntValue = 45, !0;
  if (!e.switchU && e.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(e))
      return !0;
    e.pos = t;
  }
  return this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e);
};
Y.regexp_classSetExpression = function(e) {
  var t = Dn, n;
  if (!this.regexp_eatClassSetRange(e)) if (n = this.regexp_eatClassSetOperand(e)) {
    n === wt && (t = wt);
    for (var r = e.pos; e.eatChars(
      [38, 38]
      /* && */
    ); ) {
      if (e.current() !== 38 && (n = this.regexp_eatClassSetOperand(e))) {
        n !== wt && (t = Dn);
        continue;
      }
      e.raise("Invalid character in character class");
    }
    if (r !== e.pos)
      return t;
    for (; e.eatChars(
      [45, 45]
      /* -- */
    ); )
      this.regexp_eatClassSetOperand(e) || e.raise("Invalid character in character class");
    if (r !== e.pos)
      return t;
  } else
    e.raise("Invalid character in character class");
  for (; ; )
    if (!this.regexp_eatClassSetRange(e)) {
      if (n = this.regexp_eatClassSetOperand(e), !n)
        return t;
      n === wt && (t = wt);
    }
};
Y.regexp_eatClassSetRange = function(e) {
  var t = e.pos;
  if (this.regexp_eatClassSetCharacter(e)) {
    var n = e.lastIntValue;
    if (e.eat(
      45
      /* - */
    ) && this.regexp_eatClassSetCharacter(e)) {
      var r = e.lastIntValue;
      return n !== -1 && r !== -1 && n > r && e.raise("Range out of order in character class"), !0;
    }
    e.pos = t;
  }
  return !1;
};
Y.regexp_eatClassSetOperand = function(e) {
  return this.regexp_eatClassSetCharacter(e) ? Dn : this.regexp_eatClassStringDisjunction(e) || this.regexp_eatNestedClass(e);
};
Y.regexp_eatNestedClass = function(e) {
  var t = e.pos;
  if (e.eat(
    91
    /* [ */
  )) {
    var n = e.eat(
      94
      /* ^ */
    ), r = this.regexp_classContents(e);
    if (e.eat(
      93
      /* ] */
    ))
      return n && r === wt && e.raise("Negated character class may contain strings"), r;
    e.pos = t;
  }
  if (e.eat(
    92
    /* \ */
  )) {
    var i = this.regexp_eatCharacterClassEscape(e);
    if (i)
      return i;
    e.pos = t;
  }
  return null;
};
Y.regexp_eatClassStringDisjunction = function(e) {
  var t = e.pos;
  if (e.eatChars(
    [92, 113]
    /* \q */
  )) {
    if (e.eat(
      123
      /* { */
    )) {
      var n = this.regexp_classStringDisjunctionContents(e);
      if (e.eat(
        125
        /* } */
      ))
        return n;
    } else
      e.raise("Invalid escape");
    e.pos = t;
  }
  return null;
};
Y.regexp_classStringDisjunctionContents = function(e) {
  for (var t = this.regexp_classString(e); e.eat(
    124
    /* | */
  ); )
    this.regexp_classString(e) === wt && (t = wt);
  return t;
};
Y.regexp_classString = function(e) {
  for (var t = 0; this.regexp_eatClassSetCharacter(e); )
    t++;
  return t === 1 ? Dn : wt;
};
Y.regexp_eatClassSetCharacter = function(e) {
  var t = e.pos;
  if (e.eat(
    92
    /* \ */
  ))
    return this.regexp_eatCharacterEscape(e) || this.regexp_eatClassSetReservedPunctuator(e) ? !0 : e.eat(
      98
      /* b */
    ) ? (e.lastIntValue = 8, !0) : (e.pos = t, !1);
  var n = e.current();
  return n < 0 || n === e.lookahead() && Gv(n) || Xv(n) ? !1 : (e.advance(), e.lastIntValue = n, !0);
};
function Gv(e) {
  return e === 33 || e >= 35 && e <= 38 || e >= 42 && e <= 44 || e === 46 || e >= 58 && e <= 64 || e === 94 || e === 96 || e === 126;
}
function Xv(e) {
  return e === 40 || e === 41 || e === 45 || e === 47 || e >= 91 && e <= 93 || e >= 123 && e <= 125;
}
Y.regexp_eatClassSetReservedPunctuator = function(e) {
  var t = e.current();
  return Zv(t) ? (e.lastIntValue = t, e.advance(), !0) : !1;
};
function Zv(e) {
  return e === 33 || e === 35 || e === 37 || e === 38 || e === 44 || e === 45 || e >= 58 && e <= 62 || e === 64 || e === 96 || e === 126;
}
Y.regexp_eatClassControlLetter = function(e) {
  var t = e.current();
  return Qi(t) || t === 95 ? (e.lastIntValue = t % 32, e.advance(), !0) : !1;
};
Y.regexp_eatHexEscapeSequence = function(e) {
  var t = e.pos;
  if (e.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(e, 2))
      return !0;
    e.switchU && e.raise("Invalid escape"), e.pos = t;
  }
  return !1;
};
Y.regexp_eatDecimalDigits = function(e) {
  var t = e.pos, n = 0;
  for (e.lastIntValue = 0; Qi(n = e.current()); )
    e.lastIntValue = 10 * e.lastIntValue + (n - 48), e.advance();
  return e.pos !== t;
};
function Qi(e) {
  return e >= 48 && e <= 57;
}
Y.regexp_eatHexDigits = function(e) {
  var t = e.pos, n = 0;
  for (e.lastIntValue = 0; ym(n = e.current()); )
    e.lastIntValue = 16 * e.lastIntValue + bm(n), e.advance();
  return e.pos !== t;
};
function ym(e) {
  return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function bm(e) {
  return e >= 65 && e <= 70 ? 10 + (e - 65) : e >= 97 && e <= 102 ? 10 + (e - 97) : e - 48;
}
Y.regexp_eatLegacyOctalEscapeSequence = function(e) {
  if (this.regexp_eatOctalDigit(e)) {
    var t = e.lastIntValue;
    if (this.regexp_eatOctalDigit(e)) {
      var n = e.lastIntValue;
      t <= 3 && this.regexp_eatOctalDigit(e) ? e.lastIntValue = t * 64 + n * 8 + e.lastIntValue : e.lastIntValue = t * 8 + n;
    } else
      e.lastIntValue = t;
    return !0;
  }
  return !1;
};
Y.regexp_eatOctalDigit = function(e) {
  var t = e.current();
  return Am(t) ? (e.lastIntValue = t - 48, e.advance(), !0) : (e.lastIntValue = 0, !1);
};
function Am(e) {
  return e >= 48 && e <= 55;
}
Y.regexp_eatFixedHexDigits = function(e, t) {
  var n = e.pos;
  e.lastIntValue = 0;
  for (var r = 0; r < t; ++r) {
    var i = e.current();
    if (!ym(i))
      return e.pos = n, !1;
    e.lastIntValue = 16 * e.lastIntValue + bm(i), e.advance();
  }
  return !0;
};
var fa = function(t) {
  this.type = t.type, this.value = t.value, this.start = t.start, this.end = t.end, t.options.locations && (this.loc = new Ji(t, t.startLoc, t.endLoc)), t.options.ranges && (this.range = [t.start, t.end]);
}, ve = Ue.prototype;
ve.next = function(e) {
  !e && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new fa(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
};
ve.getToken = function() {
  return this.next(), new fa(this);
};
typeof Symbol < "u" && (ve[Symbol.iterator] = function() {
  var e = this;
  return {
    next: function() {
      var t = e.getToken();
      return {
        done: t.type === b.eof,
        value: t
      };
    }
  };
});
ve.nextToken = function() {
  var e = this.curContext();
  if ((!e || !e.preserveSpace) && this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length)
    return this.finishToken(b.eof);
  if (e.override)
    return e.override(this);
  this.readToken(this.fullCharCodeAtPos());
};
ve.readToken = function(e) {
  return vn(e, this.options.ecmaVersion >= 6) || e === 92 ? this.readWord() : this.getTokenFromCode(e);
};
ve.fullCharCodeAtPos = function() {
  var e = this.input.charCodeAt(this.pos);
  if (e <= 55295 || e >= 56320)
    return e;
  var t = this.input.charCodeAt(this.pos + 1);
  return t <= 56319 || t >= 57344 ? e : (e << 10) + t - 56613888;
};
ve.skipBlockComment = function() {
  var e = this.options.onComment && this.curPosition(), t = this.pos, n = this.input.indexOf("*/", this.pos += 2);
  if (n === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = n + 2, this.options.locations)
    for (var r = void 0, i = t; (r = Wd(this.input, i, this.pos)) > -1; )
      ++this.curLine, i = this.lineStart = r;
  this.options.onComment && this.options.onComment(
    !0,
    this.input.slice(t + 2, n),
    t,
    this.pos,
    e,
    this.curPosition()
  );
};
ve.skipLineComment = function(e) {
  for (var t = this.pos, n = this.options.onComment && this.curPosition(), r = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !vr(r); )
    r = this.input.charCodeAt(++this.pos);
  this.options.onComment && this.options.onComment(
    !1,
    this.input.slice(t + e, this.pos),
    t,
    this.pos,
    n,
    this.curPosition()
  );
};
ve.skipSpace = function() {
  e: for (; this.pos < this.input.length; ) {
    var e = this.input.charCodeAt(this.pos);
    switch (e) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
      case 10:
      case 8232:
      case 8233:
        ++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
        break;
      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;
          case 47:
            this.skipLineComment(2);
            break;
          default:
            break e;
        }
        break;
      default:
        if (e > 8 && e < 14 || e >= 5760 && Od.test(String.fromCharCode(e)))
          ++this.pos;
        else
          break e;
    }
  }
};
ve.finishToken = function(e, t) {
  this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
  var n = this.type;
  this.type = e, this.value = t, this.updateContext(n);
};
ve.readToken_dot = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  if (e >= 48 && e <= 57)
    return this.readNumber(!0);
  var t = this.input.charCodeAt(this.pos + 2);
  return this.options.ecmaVersion >= 6 && e === 46 && t === 46 ? (this.pos += 3, this.finishToken(b.ellipsis)) : (++this.pos, this.finishToken(b.dot));
};
ve.readToken_slash = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  return this.exprAllowed ? (++this.pos, this.readRegexp()) : e === 61 ? this.finishOp(b.assign, 2) : this.finishOp(b.slash, 1);
};
ve.readToken_mult_modulo_exp = function(e) {
  var t = this.input.charCodeAt(this.pos + 1), n = 1, r = e === 42 ? b.star : b.modulo;
  return this.options.ecmaVersion >= 7 && e === 42 && t === 42 && (++n, r = b.starstar, t = this.input.charCodeAt(this.pos + 2)), t === 61 ? this.finishOp(b.assign, n + 1) : this.finishOp(r, n);
};
ve.readToken_pipe_amp = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  if (t === e) {
    if (this.options.ecmaVersion >= 12) {
      var n = this.input.charCodeAt(this.pos + 2);
      if (n === 61)
        return this.finishOp(b.assign, 3);
    }
    return this.finishOp(e === 124 ? b.logicalOR : b.logicalAND, 2);
  }
  return t === 61 ? this.finishOp(b.assign, 2) : this.finishOp(e === 124 ? b.bitwiseOR : b.bitwiseAND, 1);
};
ve.readToken_caret = function() {
  var e = this.input.charCodeAt(this.pos + 1);
  return e === 61 ? this.finishOp(b.assign, 2) : this.finishOp(b.bitwiseXOR, 1);
};
ve.readToken_plus_min = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === e ? t === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || kt.test(this.input.slice(this.lastTokEnd, this.pos))) ? (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : this.finishOp(b.incDec, 2) : t === 61 ? this.finishOp(b.assign, 2) : this.finishOp(b.plusMin, 1);
};
ve.readToken_lt_gt = function(e) {
  var t = this.input.charCodeAt(this.pos + 1), n = 1;
  return t === e ? (n = e === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + n) === 61 ? this.finishOp(b.assign, n + 1) : this.finishOp(b.bitShift, n)) : t === 33 && e === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45 ? (this.skipLineComment(4), this.skipSpace(), this.nextToken()) : (t === 61 && (n = 2), this.finishOp(b.relational, n));
};
ve.readToken_eq_excl = function(e) {
  var t = this.input.charCodeAt(this.pos + 1);
  return t === 61 ? this.finishOp(b.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : e === 61 && t === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(b.arrow)) : this.finishOp(e === 61 ? b.eq : b.prefix, 1);
};
ve.readToken_question = function() {
  var e = this.options.ecmaVersion;
  if (e >= 11) {
    var t = this.input.charCodeAt(this.pos + 1);
    if (t === 46) {
      var n = this.input.charCodeAt(this.pos + 2);
      if (n < 48 || n > 57)
        return this.finishOp(b.questionDot, 2);
    }
    if (t === 63) {
      if (e >= 12) {
        var r = this.input.charCodeAt(this.pos + 2);
        if (r === 61)
          return this.finishOp(b.assign, 3);
      }
      return this.finishOp(b.coalesce, 2);
    }
  }
  return this.finishOp(b.question, 1);
};
ve.readToken_numberSign = function() {
  var e = this.options.ecmaVersion, t = 35;
  if (e >= 13 && (++this.pos, t = this.fullCharCodeAtPos(), vn(t, !0) || t === 92))
    return this.finishToken(b.privateId, this.readWord1());
  this.raise(this.pos, "Unexpected character '" + Pn(t) + "'");
};
ve.getTokenFromCode = function(e) {
  switch (e) {
    // The interpretation of a dot depends on whether it is followed
    // by a digit or another two dots.
    case 46:
      return this.readToken_dot();
    // Punctuation tokens.
    case 40:
      return ++this.pos, this.finishToken(b.parenL);
    case 41:
      return ++this.pos, this.finishToken(b.parenR);
    case 59:
      return ++this.pos, this.finishToken(b.semi);
    case 44:
      return ++this.pos, this.finishToken(b.comma);
    case 91:
      return ++this.pos, this.finishToken(b.bracketL);
    case 93:
      return ++this.pos, this.finishToken(b.bracketR);
    case 123:
      return ++this.pos, this.finishToken(b.braceL);
    case 125:
      return ++this.pos, this.finishToken(b.braceR);
    case 58:
      return ++this.pos, this.finishToken(b.colon);
    case 96:
      if (this.options.ecmaVersion < 6)
        break;
      return ++this.pos, this.finishToken(b.backQuote);
    case 48:
      var t = this.input.charCodeAt(this.pos + 1);
      if (t === 120 || t === 88)
        return this.readRadixNumber(16);
      if (this.options.ecmaVersion >= 6) {
        if (t === 111 || t === 79)
          return this.readRadixNumber(8);
        if (t === 98 || t === 66)
          return this.readRadixNumber(2);
      }
    // Anything else beginning with a digit is an integer, octal
    // number, or float.
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(!1);
    // Quotes produce strings.
    case 34:
    case 39:
      return this.readString(e);
    // Operators are parsed inline in tiny state machines. '=' (61) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(e);
    case 124:
    case 38:
      return this.readToken_pipe_amp(e);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(e);
    case 60:
    case 62:
      return this.readToken_lt_gt(e);
    case 61:
    case 33:
      return this.readToken_eq_excl(e);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(b.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + Pn(e) + "'");
};
ve.finishOp = function(e, t) {
  var n = this.input.slice(this.pos, this.pos + t);
  return this.pos += t, this.finishToken(e, n);
};
ve.readRegexp = function() {
  for (var e, t, n = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(n, "Unterminated regular expression");
    var r = this.input.charAt(this.pos);
    if (kt.test(r) && this.raise(n, "Unterminated regular expression"), e)
      e = !1;
    else {
      if (r === "[")
        t = !0;
      else if (r === "]" && t)
        t = !1;
      else if (r === "/" && !t)
        break;
      e = r === "\\";
    }
    ++this.pos;
  }
  var i = this.input.slice(n, this.pos);
  ++this.pos;
  var s = this.pos, u = this.readWord1();
  this.containsEsc && this.unexpected(s);
  var a = this.regexpState || (this.regexpState = new on(this));
  a.reset(n, i, u), this.validateRegExpFlags(a), this.validateRegExpPattern(a);
  var o = null;
  try {
    o = new RegExp(i, u);
  } catch {
  }
  return this.finishToken(b.regexp, { pattern: i, flags: u, value: o });
};
ve.readInt = function(e, t, n) {
  for (var r = this.options.ecmaVersion >= 12 && t === void 0, i = n && this.input.charCodeAt(this.pos) === 48, s = this.pos, u = 0, a = 0, o = 0, f = t ?? 1 / 0; o < f; ++o, ++this.pos) {
    var h = this.input.charCodeAt(this.pos), m = void 0;
    if (r && h === 95) {
      i && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), a === 95 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), o === 0 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), a = h;
      continue;
    }
    if (h >= 97 ? m = h - 97 + 10 : h >= 65 ? m = h - 65 + 10 : h >= 48 && h <= 57 ? m = h - 48 : m = 1 / 0, m >= e)
      break;
    a = h, u = u * e + m;
  }
  return r && a === 95 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === s || t != null && this.pos - s !== t ? null : u;
};
function Wv(e, t) {
  return t ? parseInt(e, 8) : parseFloat(e.replace(/_/g, ""));
}
function Mm(e) {
  return typeof BigInt != "function" ? null : BigInt(e.replace(/_/g, ""));
}
ve.readRadixNumber = function(e) {
  var t = this.pos;
  this.pos += 2;
  var n = this.readInt(e);
  return n == null && this.raise(this.start + 2, "Expected number in radix " + e), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (n = Mm(this.input.slice(t, this.pos)), ++this.pos) : vn(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(b.num, n);
};
ve.readNumber = function(e) {
  var t = this.pos;
  !e && this.readInt(10, void 0, !0) === null && this.raise(t, "Invalid number");
  var n = this.pos - t >= 2 && this.input.charCodeAt(t) === 48;
  n && this.strict && this.raise(t, "Invalid number");
  var r = this.input.charCodeAt(this.pos);
  if (!n && !e && this.options.ecmaVersion >= 11 && r === 110) {
    var i = Mm(this.input.slice(t, this.pos));
    return ++this.pos, vn(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(b.num, i);
  }
  n && /[89]/.test(this.input.slice(t, this.pos)) && (n = !1), r === 46 && !n && (++this.pos, this.readInt(10), r = this.input.charCodeAt(this.pos)), (r === 69 || r === 101) && !n && (r = this.input.charCodeAt(++this.pos), (r === 43 || r === 45) && ++this.pos, this.readInt(10) === null && this.raise(t, "Invalid number")), vn(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
  var s = Wv(this.input.slice(t, this.pos), n);
  return this.finishToken(b.num, s);
};
ve.readCodePoint = function() {
  var e = this.input.charCodeAt(this.pos), t;
  if (e === 123) {
    this.options.ecmaVersion < 6 && this.unexpected();
    var n = ++this.pos;
    t = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, t > 1114111 && this.invalidStringToken(n, "Code point out of bounds");
  } else
    t = this.readHexChar(4);
  return t;
};
ve.readString = function(e) {
  for (var t = "", n = ++this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
    var r = this.input.charCodeAt(this.pos);
    if (r === e)
      break;
    r === 92 ? (t += this.input.slice(n, this.pos), t += this.readEscapedChar(!1), n = this.pos) : r === 8232 || r === 8233 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (vr(r) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
  }
  return t += this.input.slice(n, this.pos++), this.finishToken(b.string, t);
};
var Cm = {};
ve.tryReadTemplateToken = function() {
  this.inTemplateElement = !0;
  try {
    this.readTmplToken();
  } catch (e) {
    if (e === Cm)
      this.readInvalidTemplateToken();
    else
      throw e;
  }
  this.inTemplateElement = !1;
};
ve.invalidStringToken = function(e, t) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9)
    throw Cm;
  this.raise(e, t);
};
ve.readTmplToken = function() {
  for (var e = "", t = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
    var n = this.input.charCodeAt(this.pos);
    if (n === 96 || n === 36 && this.input.charCodeAt(this.pos + 1) === 123)
      return this.pos === this.start && (this.type === b.template || this.type === b.invalidTemplate) ? n === 36 ? (this.pos += 2, this.finishToken(b.dollarBraceL)) : (++this.pos, this.finishToken(b.backQuote)) : (e += this.input.slice(t, this.pos), this.finishToken(b.template, e));
    if (n === 92)
      e += this.input.slice(t, this.pos), e += this.readEscapedChar(!0), t = this.pos;
    else if (vr(n)) {
      switch (e += this.input.slice(t, this.pos), ++this.pos, n) {
        case 13:
          this.input.charCodeAt(this.pos) === 10 && ++this.pos;
        case 10:
          e += `
`;
          break;
        default:
          e += String.fromCharCode(n);
          break;
      }
      this.options.locations && (++this.curLine, this.lineStart = this.pos), t = this.pos;
    } else
      ++this.pos;
  }
};
ve.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++)
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{")
          break;
      // fall through
      case "`":
        return this.finishToken(b.invalidTemplate, this.input.slice(this.start, this.pos));
      case "\r":
        this.input[this.pos + 1] === `
` && ++this.pos;
      // fall through
      case `
`:
      case "\u2028":
      case "\u2029":
        ++this.curLine, this.lineStart = this.pos + 1;
        break;
    }
  this.raise(this.start, "Unterminated template");
};
ve.readEscapedChar = function(e) {
  var t = this.input.charCodeAt(++this.pos);
  switch (++this.pos, t) {
    case 110:
      return `
`;
    // 'n' -> '\n'
    case 114:
      return "\r";
    // 'r' -> '\r'
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    // 'x'
    case 117:
      return Pn(this.readCodePoint());
    // 'u'
    case 116:
      return "	";
    // 't' -> '\t'
    case 98:
      return "\b";
    // 'b' -> '\b'
    case 118:
      return "\v";
    // 'v' -> '\u000b'
    case 102:
      return "\f";
    // 'f' -> '\f'
    case 13:
      this.input.charCodeAt(this.pos) === 10 && ++this.pos;
    // '\r\n'
    case 10:
      return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
    case 56:
    case 57:
      if (this.strict && this.invalidStringToken(
        this.pos - 1,
        "Invalid escape sequence"
      ), e) {
        var n = this.pos - 1;
        this.invalidStringToken(
          n,
          "Invalid escape sequence in template string"
        );
      }
    default:
      if (t >= 48 && t <= 55) {
        var r = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], i = parseInt(r, 8);
        return i > 255 && (r = r.slice(0, -1), i = parseInt(r, 8)), this.pos += r.length - 1, t = this.input.charCodeAt(this.pos), (r !== "0" || t === 56 || t === 57) && (this.strict || e) && this.invalidStringToken(
          this.pos - 1 - r.length,
          e ? "Octal literal in template string" : "Octal literal in strict mode"
        ), String.fromCharCode(i);
      }
      return vr(t) ? (this.options.locations && (this.lineStart = this.pos, ++this.curLine), "") : String.fromCharCode(t);
  }
};
ve.readHexChar = function(e) {
  var t = this.pos, n = this.readInt(16, e);
  return n === null && this.invalidStringToken(t, "Bad character escape sequence"), n;
};
ve.readWord1 = function() {
  this.containsEsc = !1;
  for (var e = "", t = !0, n = this.pos, r = this.options.ecmaVersion >= 6; this.pos < this.input.length; ) {
    var i = this.fullCharCodeAtPos();
    if (mr(i, r))
      this.pos += i <= 65535 ? 1 : 2;
    else if (i === 92) {
      this.containsEsc = !0, e += this.input.slice(n, this.pos);
      var s = this.pos;
      this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
      var u = this.readCodePoint();
      (t ? vn : mr)(u, r) || this.invalidStringToken(s, "Invalid Unicode escape"), e += Pn(u), n = this.pos;
    } else
      break;
    t = !1;
  }
  return e + this.input.slice(n, this.pos);
};
ve.readWord = function() {
  var e = this.readWord1(), t = b.name;
  return this.keywords.test(e) && (t = ia[e]), this.finishToken(t, e);
};
var Ov = "8.14.0";
Ue.acorn = {
  Parser: Ue,
  version: Ov,
  defaultOptions: lu,
  Position: Qr,
  SourceLocation: Ji,
  getLineInfo: jd,
  Node: Ui,
  TokenType: we,
  tokTypes: b,
  keywordTypes: ia,
  TokContext: Zt,
  tokContexts: Xe,
  isIdentifierChar: mr,
  isIdentifierStart: vn,
  Token: fa,
  isNewLine: vr,
  lineBreak: kt,
  lineBreakG: fv,
  nonASCIIwhitespace: Od
};
function zv(e, t) {
  return Ue.parse(e, t);
}
var jv = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function vm(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function $v(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
var Is = {}, Vs = {}, Mo;
function qv() {
  return Mo || (Mo = 1, function(e) {
    (function t(n) {
      var r, i, s, u, a, o;
      function f(x) {
        var B = {}, I, V;
        for (I in x)
          x.hasOwnProperty(I) && (V = x[I], typeof V == "object" && V !== null ? B[I] = f(V) : B[I] = V);
        return B;
      }
      function h(x, B) {
        var I, V, q, X;
        for (V = x.length, q = 0; V; )
          I = V >>> 1, X = q + I, B(x[X]) ? V = I : (q = X + 1, V -= I + 1);
        return q;
      }
      r = {
        AssignmentExpression: "AssignmentExpression",
        AssignmentPattern: "AssignmentPattern",
        ArrayExpression: "ArrayExpression",
        ArrayPattern: "ArrayPattern",
        ArrowFunctionExpression: "ArrowFunctionExpression",
        AwaitExpression: "AwaitExpression",
        // CAUTION: It's deferred to ES7.
        BlockStatement: "BlockStatement",
        BinaryExpression: "BinaryExpression",
        BreakStatement: "BreakStatement",
        CallExpression: "CallExpression",
        CatchClause: "CatchClause",
        ChainExpression: "ChainExpression",
        ClassBody: "ClassBody",
        ClassDeclaration: "ClassDeclaration",
        ClassExpression: "ClassExpression",
        ComprehensionBlock: "ComprehensionBlock",
        // CAUTION: It's deferred to ES7.
        ComprehensionExpression: "ComprehensionExpression",
        // CAUTION: It's deferred to ES7.
        ConditionalExpression: "ConditionalExpression",
        ContinueStatement: "ContinueStatement",
        DebuggerStatement: "DebuggerStatement",
        DirectiveStatement: "DirectiveStatement",
        DoWhileStatement: "DoWhileStatement",
        EmptyStatement: "EmptyStatement",
        ExportAllDeclaration: "ExportAllDeclaration",
        ExportDefaultDeclaration: "ExportDefaultDeclaration",
        ExportNamedDeclaration: "ExportNamedDeclaration",
        ExportSpecifier: "ExportSpecifier",
        ExpressionStatement: "ExpressionStatement",
        ForStatement: "ForStatement",
        ForInStatement: "ForInStatement",
        ForOfStatement: "ForOfStatement",
        FunctionDeclaration: "FunctionDeclaration",
        FunctionExpression: "FunctionExpression",
        GeneratorExpression: "GeneratorExpression",
        // CAUTION: It's deferred to ES7.
        Identifier: "Identifier",
        IfStatement: "IfStatement",
        ImportExpression: "ImportExpression",
        ImportDeclaration: "ImportDeclaration",
        ImportDefaultSpecifier: "ImportDefaultSpecifier",
        ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
        ImportSpecifier: "ImportSpecifier",
        Literal: "Literal",
        LabeledStatement: "LabeledStatement",
        LogicalExpression: "LogicalExpression",
        MemberExpression: "MemberExpression",
        MetaProperty: "MetaProperty",
        MethodDefinition: "MethodDefinition",
        ModuleSpecifier: "ModuleSpecifier",
        NewExpression: "NewExpression",
        ObjectExpression: "ObjectExpression",
        ObjectPattern: "ObjectPattern",
        PrivateIdentifier: "PrivateIdentifier",
        Program: "Program",
        Property: "Property",
        PropertyDefinition: "PropertyDefinition",
        RestElement: "RestElement",
        ReturnStatement: "ReturnStatement",
        SequenceExpression: "SequenceExpression",
        SpreadElement: "SpreadElement",
        Super: "Super",
        SwitchStatement: "SwitchStatement",
        SwitchCase: "SwitchCase",
        TaggedTemplateExpression: "TaggedTemplateExpression",
        TemplateElement: "TemplateElement",
        TemplateLiteral: "TemplateLiteral",
        ThisExpression: "ThisExpression",
        ThrowStatement: "ThrowStatement",
        TryStatement: "TryStatement",
        UnaryExpression: "UnaryExpression",
        UpdateExpression: "UpdateExpression",
        VariableDeclaration: "VariableDeclaration",
        VariableDeclarator: "VariableDeclarator",
        WhileStatement: "WhileStatement",
        WithStatement: "WithStatement",
        YieldExpression: "YieldExpression"
      }, s = {
        AssignmentExpression: ["left", "right"],
        AssignmentPattern: ["left", "right"],
        ArrayExpression: ["elements"],
        ArrayPattern: ["elements"],
        ArrowFunctionExpression: ["params", "body"],
        AwaitExpression: ["argument"],
        // CAUTION: It's deferred to ES7.
        BlockStatement: ["body"],
        BinaryExpression: ["left", "right"],
        BreakStatement: ["label"],
        CallExpression: ["callee", "arguments"],
        CatchClause: ["param", "body"],
        ChainExpression: ["expression"],
        ClassBody: ["body"],
        ClassDeclaration: ["id", "superClass", "body"],
        ClassExpression: ["id", "superClass", "body"],
        ComprehensionBlock: ["left", "right"],
        // CAUTION: It's deferred to ES7.
        ComprehensionExpression: ["blocks", "filter", "body"],
        // CAUTION: It's deferred to ES7.
        ConditionalExpression: ["test", "consequent", "alternate"],
        ContinueStatement: ["label"],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: ["body", "test"],
        EmptyStatement: [],
        ExportAllDeclaration: ["source"],
        ExportDefaultDeclaration: ["declaration"],
        ExportNamedDeclaration: ["declaration", "specifiers", "source"],
        ExportSpecifier: ["exported", "local"],
        ExpressionStatement: ["expression"],
        ForStatement: ["init", "test", "update", "body"],
        ForInStatement: ["left", "right", "body"],
        ForOfStatement: ["left", "right", "body"],
        FunctionDeclaration: ["id", "params", "body"],
        FunctionExpression: ["id", "params", "body"],
        GeneratorExpression: ["blocks", "filter", "body"],
        // CAUTION: It's deferred to ES7.
        Identifier: [],
        IfStatement: ["test", "consequent", "alternate"],
        ImportExpression: ["source"],
        ImportDeclaration: ["specifiers", "source"],
        ImportDefaultSpecifier: ["local"],
        ImportNamespaceSpecifier: ["local"],
        ImportSpecifier: ["imported", "local"],
        Literal: [],
        LabeledStatement: ["label", "body"],
        LogicalExpression: ["left", "right"],
        MemberExpression: ["object", "property"],
        MetaProperty: ["meta", "property"],
        MethodDefinition: ["key", "value"],
        ModuleSpecifier: [],
        NewExpression: ["callee", "arguments"],
        ObjectExpression: ["properties"],
        ObjectPattern: ["properties"],
        PrivateIdentifier: [],
        Program: ["body"],
        Property: ["key", "value"],
        PropertyDefinition: ["key", "value"],
        RestElement: ["argument"],
        ReturnStatement: ["argument"],
        SequenceExpression: ["expressions"],
        SpreadElement: ["argument"],
        Super: [],
        SwitchStatement: ["discriminant", "cases"],
        SwitchCase: ["test", "consequent"],
        TaggedTemplateExpression: ["tag", "quasi"],
        TemplateElement: [],
        TemplateLiteral: ["quasis", "expressions"],
        ThisExpression: [],
        ThrowStatement: ["argument"],
        TryStatement: ["block", "handler", "finalizer"],
        UnaryExpression: ["argument"],
        UpdateExpression: ["argument"],
        VariableDeclaration: ["declarations"],
        VariableDeclarator: ["id", "init"],
        WhileStatement: ["test", "body"],
        WithStatement: ["object", "body"],
        YieldExpression: ["argument"]
      }, u = {}, a = {}, o = {}, i = {
        Break: u,
        Skip: a,
        Remove: o
      };
      function m(x, B) {
        this.parent = x, this.key = B;
      }
      m.prototype.replace = function(B) {
        this.parent[this.key] = B;
      }, m.prototype.remove = function() {
        return Array.isArray(this.parent) ? (this.parent.splice(this.key, 1), !0) : (this.replace(null), !1);
      };
      function p(x, B, I, V) {
        this.node = x, this.path = B, this.wrap = I, this.ref = V;
      }
      function A() {
      }
      A.prototype.path = function() {
        var B, I, V, q, X, U;
        function O(W, ee) {
          if (Array.isArray(ee))
            for (V = 0, q = ee.length; V < q; ++V)
              W.push(ee[V]);
          else
            W.push(ee);
        }
        if (!this.__current.path)
          return null;
        for (X = [], B = 2, I = this.__leavelist.length; B < I; ++B)
          U = this.__leavelist[B], O(X, U.path);
        return O(X, this.__current.path), X;
      }, A.prototype.type = function() {
        var x = this.current();
        return x.type || this.__current.wrap;
      }, A.prototype.parents = function() {
        var B, I, V;
        for (V = [], B = 1, I = this.__leavelist.length; B < I; ++B)
          V.push(this.__leavelist[B].node);
        return V;
      }, A.prototype.current = function() {
        return this.__current.node;
      }, A.prototype.__execute = function(B, I) {
        var V, q;
        return q = void 0, V = this.__current, this.__current = I, this.__state = null, B && (q = B.call(this, I.node, this.__leavelist[this.__leavelist.length - 1].node)), this.__current = V, q;
      }, A.prototype.notify = function(B) {
        this.__state = B;
      }, A.prototype.skip = function() {
        this.notify(a);
      }, A.prototype.break = function() {
        this.notify(u);
      }, A.prototype.remove = function() {
        this.notify(o);
      }, A.prototype.__initialize = function(x, B) {
        this.visitor = B, this.root = x, this.__worklist = [], this.__leavelist = [], this.__current = null, this.__state = null, this.__fallback = null, B.fallback === "iteration" ? this.__fallback = Object.keys : typeof B.fallback == "function" && (this.__fallback = B.fallback), this.__keys = s, B.keys && (this.__keys = Object.assign(Object.create(this.__keys), B.keys));
      };
      function M(x) {
        return x == null ? !1 : typeof x == "object" && typeof x.type == "string";
      }
      function v(x, B) {
        return (x === r.ObjectExpression || x === r.ObjectPattern) && B === "properties";
      }
      function E(x, B) {
        for (var I = x.length - 1; I >= 0; --I)
          if (x[I].node === B)
            return !0;
        return !1;
      }
      A.prototype.traverse = function(B, I) {
        var V, q, X, U, O, W, ee, be, pe, le, ie, Ie;
        for (this.__initialize(B, I), Ie = {}, V = this.__worklist, q = this.__leavelist, V.push(new p(B, null, null, null)), q.push(new p(null, null, null, null)); V.length; ) {
          if (X = V.pop(), X === Ie) {
            if (X = q.pop(), W = this.__execute(I.leave, X), this.__state === u || W === u)
              return;
            continue;
          }
          if (X.node) {
            if (W = this.__execute(I.enter, X), this.__state === u || W === u)
              return;
            if (V.push(Ie), q.push(X), this.__state === a || W === a)
              continue;
            if (U = X.node, O = U.type || X.wrap, le = this.__keys[O], !le)
              if (this.__fallback)
                le = this.__fallback(U);
              else
                throw new Error("Unknown node type " + O + ".");
            for (be = le.length; (be -= 1) >= 0; )
              if (ee = le[be], ie = U[ee], !!ie) {
                if (Array.isArray(ie)) {
                  for (pe = ie.length; (pe -= 1) >= 0; )
                    if (ie[pe] && !E(q, ie[pe])) {
                      if (v(O, le[be]))
                        X = new p(ie[pe], [ee, pe], "Property", null);
                      else if (M(ie[pe]))
                        X = new p(ie[pe], [ee, pe], null, null);
                      else
                        continue;
                      V.push(X);
                    }
                } else if (M(ie)) {
                  if (E(q, ie))
                    continue;
                  V.push(new p(ie, ee, null, null));
                }
              }
          }
        }
      }, A.prototype.replace = function(B, I) {
        var V, q, X, U, O, W, ee, be, pe, le, ie, Ie, oe;
        function ge($) {
          var Pe, it, ze, Ae;
          if ($.ref.remove()) {
            for (it = $.ref.key, Ae = $.ref.parent, Pe = V.length; Pe--; )
              if (ze = V[Pe], ze.ref && ze.ref.parent === Ae) {
                if (ze.ref.key < it)
                  break;
                --ze.ref.key;
              }
          }
        }
        for (this.__initialize(B, I), ie = {}, V = this.__worklist, q = this.__leavelist, Ie = {
          root: B
        }, W = new p(B, null, null, new m(Ie, "root")), V.push(W), q.push(W); V.length; ) {
          if (W = V.pop(), W === ie) {
            if (W = q.pop(), O = this.__execute(I.leave, W), O !== void 0 && O !== u && O !== a && O !== o && W.ref.replace(O), (this.__state === o || O === o) && ge(W), this.__state === u || O === u)
              return Ie.root;
            continue;
          }
          if (O = this.__execute(I.enter, W), O !== void 0 && O !== u && O !== a && O !== o && (W.ref.replace(O), W.node = O), (this.__state === o || O === o) && (ge(W), W.node = null), this.__state === u || O === u)
            return Ie.root;
          if (X = W.node, !!X && (V.push(ie), q.push(W), !(this.__state === a || O === a))) {
            if (U = X.type || W.wrap, pe = this.__keys[U], !pe)
              if (this.__fallback)
                pe = this.__fallback(X);
              else
                throw new Error("Unknown node type " + U + ".");
            for (ee = pe.length; (ee -= 1) >= 0; )
              if (oe = pe[ee], le = X[oe], !!le)
                if (Array.isArray(le)) {
                  for (be = le.length; (be -= 1) >= 0; )
                    if (le[be]) {
                      if (v(U, pe[ee]))
                        W = new p(le[be], [oe, be], "Property", new m(le, be));
                      else if (M(le[be]))
                        W = new p(le[be], [oe, be], null, new m(le, be));
                      else
                        continue;
                      V.push(W);
                    }
                } else M(le) && V.push(new p(le, oe, null, new m(X, oe)));
          }
        }
        return Ie.root;
      };
      function k(x, B) {
        var I = new A();
        return I.traverse(x, B);
      }
      function _(x, B) {
        var I = new A();
        return I.replace(x, B);
      }
      function G(x, B) {
        var I;
        return I = h(B, function(q) {
          return q.range[0] > x.range[0];
        }), x.extendedRange = [x.range[0], x.range[1]], I !== B.length && (x.extendedRange[1] = B[I].range[0]), I -= 1, I >= 0 && (x.extendedRange[0] = B[I].range[1]), x;
      }
      function S(x, B, I) {
        var V = [], q, X, U, O;
        if (!x.range)
          throw new Error("attachComments needs range information");
        if (!I.length) {
          if (B.length) {
            for (U = 0, X = B.length; U < X; U += 1)
              q = f(B[U]), q.extendedRange = [0, x.range[0]], V.push(q);
            x.leadingComments = V;
          }
          return x;
        }
        for (U = 0, X = B.length; U < X; U += 1)
          V.push(G(f(B[U]), I));
        return O = 0, k(x, {
          enter: function(W) {
            for (var ee; O < V.length && (ee = V[O], !(ee.extendedRange[1] > W.range[0])); )
              ee.extendedRange[1] === W.range[0] ? (W.leadingComments || (W.leadingComments = []), W.leadingComments.push(ee), V.splice(O, 1)) : O += 1;
            if (O === V.length)
              return i.Break;
            if (V[O].extendedRange[0] > W.range[1])
              return i.Skip;
          }
        }), O = 0, k(x, {
          leave: function(W) {
            for (var ee; O < V.length && (ee = V[O], !(W.range[1] < ee.extendedRange[0])); )
              W.range[1] === ee.extendedRange[0] ? (W.trailingComments || (W.trailingComments = []), W.trailingComments.push(ee), V.splice(O, 1)) : O += 1;
            if (O === V.length)
              return i.Break;
            if (V[O].extendedRange[0] > W.range[1])
              return i.Skip;
          }
        }), x;
      }
      return n.Syntax = r, n.traverse = k, n.replace = _, n.attachComments = S, n.VisitorKeys = s, n.VisitorOption = i, n.Controller = A, n.cloneEnvironment = function() {
        return t({});
      }, n;
    })(e);
  }(Vs)), Vs;
}
var Lr = {}, Ns = { exports: {} }, Co;
function Kv() {
  return Co || (Co = 1, function() {
    function e(u) {
      if (u == null)
        return !1;
      switch (u.type) {
        case "ArrayExpression":
        case "AssignmentExpression":
        case "BinaryExpression":
        case "CallExpression":
        case "ConditionalExpression":
        case "FunctionExpression":
        case "Identifier":
        case "Literal":
        case "LogicalExpression":
        case "MemberExpression":
        case "NewExpression":
        case "ObjectExpression":
        case "SequenceExpression":
        case "ThisExpression":
        case "UnaryExpression":
        case "UpdateExpression":
          return !0;
      }
      return !1;
    }
    function t(u) {
      if (u == null)
        return !1;
      switch (u.type) {
        case "DoWhileStatement":
        case "ForInStatement":
        case "ForStatement":
        case "WhileStatement":
          return !0;
      }
      return !1;
    }
    function n(u) {
      if (u == null)
        return !1;
      switch (u.type) {
        case "BlockStatement":
        case "BreakStatement":
        case "ContinueStatement":
        case "DebuggerStatement":
        case "DoWhileStatement":
        case "EmptyStatement":
        case "ExpressionStatement":
        case "ForInStatement":
        case "ForStatement":
        case "IfStatement":
        case "LabeledStatement":
        case "ReturnStatement":
        case "SwitchStatement":
        case "ThrowStatement":
        case "TryStatement":
        case "VariableDeclaration":
        case "WhileStatement":
        case "WithStatement":
          return !0;
      }
      return !1;
    }
    function r(u) {
      return n(u) || u != null && u.type === "FunctionDeclaration";
    }
    function i(u) {
      switch (u.type) {
        case "IfStatement":
          return u.alternate != null ? u.alternate : u.consequent;
        case "LabeledStatement":
        case "ForStatement":
        case "ForInStatement":
        case "WhileStatement":
        case "WithStatement":
          return u.body;
      }
      return null;
    }
    function s(u) {
      var a;
      if (u.type !== "IfStatement" || u.alternate == null)
        return !1;
      a = u.consequent;
      do {
        if (a.type === "IfStatement" && a.alternate == null)
          return !0;
        a = i(a);
      } while (a);
      return !1;
    }
    Ns.exports = {
      isExpression: e,
      isStatement: n,
      isIterationStatement: t,
      isSourceElement: r,
      isProblematicIfStatement: s,
      trailingStatement: i
    };
  }()), Ns.exports;
}
var Ts = { exports: {} }, vo;
function Pm() {
  return vo || (vo = 1, function() {
    var e, t, n, r, i, s;
    t = {
      // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierStart:
      NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
      // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierPart:
      NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
    }, e = {
      // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierStart:
      NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
      // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierPart:
      NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };
    function u(E) {
      return 48 <= E && E <= 57;
    }
    function a(E) {
      return 48 <= E && E <= 57 || // 0..9
      97 <= E && E <= 102 || // a..f
      65 <= E && E <= 70;
    }
    function o(E) {
      return E >= 48 && E <= 55;
    }
    n = [
      5760,
      8192,
      8193,
      8194,
      8195,
      8196,
      8197,
      8198,
      8199,
      8200,
      8201,
      8202,
      8239,
      8287,
      12288,
      65279
    ];
    function f(E) {
      return E === 32 || E === 9 || E === 11 || E === 12 || E === 160 || E >= 5760 && n.indexOf(E) >= 0;
    }
    function h(E) {
      return E === 10 || E === 13 || E === 8232 || E === 8233;
    }
    function m(E) {
      if (E <= 65535)
        return String.fromCharCode(E);
      var k = String.fromCharCode(Math.floor((E - 65536) / 1024) + 55296), _ = String.fromCharCode((E - 65536) % 1024 + 56320);
      return k + _;
    }
    for (r = new Array(128), s = 0; s < 128; ++s)
      r[s] = s >= 97 && s <= 122 || // a..z
      s >= 65 && s <= 90 || // A..Z
      s === 36 || s === 95;
    for (i = new Array(128), s = 0; s < 128; ++s)
      i[s] = s >= 97 && s <= 122 || // a..z
      s >= 65 && s <= 90 || // A..Z
      s >= 48 && s <= 57 || // 0..9
      s === 36 || s === 95;
    function p(E) {
      return E < 128 ? r[E] : t.NonAsciiIdentifierStart.test(m(E));
    }
    function A(E) {
      return E < 128 ? i[E] : t.NonAsciiIdentifierPart.test(m(E));
    }
    function M(E) {
      return E < 128 ? r[E] : e.NonAsciiIdentifierStart.test(m(E));
    }
    function v(E) {
      return E < 128 ? i[E] : e.NonAsciiIdentifierPart.test(m(E));
    }
    Ts.exports = {
      isDecimalDigit: u,
      isHexDigit: a,
      isOctalDigit: o,
      isWhiteSpace: f,
      isLineTerminator: h,
      isIdentifierStartES5: p,
      isIdentifierPartES5: A,
      isIdentifierStartES6: M,
      isIdentifierPartES6: v
    };
  }()), Ts.exports;
}
var Ls = { exports: {} }, Po;
function Hv() {
  return Po || (Po = 1, function() {
    var e = Pm();
    function t(p) {
      switch (p) {
        case "implements":
        case "interface":
        case "package":
        case "private":
        case "protected":
        case "public":
        case "static":
        case "let":
          return !0;
        default:
          return !1;
      }
    }
    function n(p, A) {
      return !A && p === "yield" ? !1 : r(p, A);
    }
    function r(p, A) {
      if (A && t(p))
        return !0;
      switch (p.length) {
        case 2:
          return p === "if" || p === "in" || p === "do";
        case 3:
          return p === "var" || p === "for" || p === "new" || p === "try";
        case 4:
          return p === "this" || p === "else" || p === "case" || p === "void" || p === "with" || p === "enum";
        case 5:
          return p === "while" || p === "break" || p === "catch" || p === "throw" || p === "const" || p === "yield" || p === "class" || p === "super";
        case 6:
          return p === "return" || p === "typeof" || p === "delete" || p === "switch" || p === "export" || p === "import";
        case 7:
          return p === "default" || p === "finally" || p === "extends";
        case 8:
          return p === "function" || p === "continue" || p === "debugger";
        case 10:
          return p === "instanceof";
        default:
          return !1;
      }
    }
    function i(p, A) {
      return p === "null" || p === "true" || p === "false" || n(p, A);
    }
    function s(p, A) {
      return p === "null" || p === "true" || p === "false" || r(p, A);
    }
    function u(p) {
      return p === "eval" || p === "arguments";
    }
    function a(p) {
      var A, M, v;
      if (p.length === 0 || (v = p.charCodeAt(0), !e.isIdentifierStartES5(v)))
        return !1;
      for (A = 1, M = p.length; A < M; ++A)
        if (v = p.charCodeAt(A), !e.isIdentifierPartES5(v))
          return !1;
      return !0;
    }
    function o(p, A) {
      return (p - 55296) * 1024 + (A - 56320) + 65536;
    }
    function f(p) {
      var A, M, v, E, k;
      if (p.length === 0)
        return !1;
      for (k = e.isIdentifierStartES6, A = 0, M = p.length; A < M; ++A) {
        if (v = p.charCodeAt(A), 55296 <= v && v <= 56319) {
          if (++A, A >= M || (E = p.charCodeAt(A), !(56320 <= E && E <= 57343)))
            return !1;
          v = o(v, E);
        }
        if (!k(v))
          return !1;
        k = e.isIdentifierPartES6;
      }
      return !0;
    }
    function h(p, A) {
      return a(p) && !i(p, A);
    }
    function m(p, A) {
      return f(p) && !s(p, A);
    }
    Ls.exports = {
      isKeywordES5: n,
      isKeywordES6: r,
      isReservedWordES5: i,
      isReservedWordES6: s,
      isRestrictedWord: u,
      isIdentifierNameES5: a,
      isIdentifierNameES6: f,
      isIdentifierES5: h,
      isIdentifierES6: m
    };
  }()), Ls.exports;
}
var Do;
function Jv() {
  return Do || (Do = 1, function() {
    Lr.ast = Kv(), Lr.code = Pm(), Lr.keyword = Hv();
  }()), Lr;
}
var Rr = {}, Rs = {}, Ai = {}, Mi = {}, Fo;
function Yv() {
  if (Fo) return Mi;
  Fo = 1;
  var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  return Mi.encode = function(t) {
    if (0 <= t && t < e.length)
      return e[t];
    throw new TypeError("Must be between 0 and 63: " + t);
  }, Mi.decode = function(t) {
    var n = 65, r = 90, i = 97, s = 122, u = 48, a = 57, o = 43, f = 47, h = 26, m = 52;
    return n <= t && t <= r ? t - n : i <= t && t <= s ? t - i + h : u <= t && t <= a ? t - u + m : t == o ? 62 : t == f ? 63 : -1;
  }, Mi;
}
var Eo;
function Dm() {
  if (Eo) return Ai;
  Eo = 1;
  var e = Yv(), t = 5, n = 1 << t, r = n - 1, i = n;
  function s(a) {
    return a < 0 ? (-a << 1) + 1 : (a << 1) + 0;
  }
  function u(a) {
    var o = (a & 1) === 1, f = a >> 1;
    return o ? -f : f;
  }
  return Ai.encode = function(o) {
    var f = "", h, m = s(o);
    do
      h = m & r, m >>>= t, m > 0 && (h |= i), f += e.encode(h);
    while (m > 0);
    return f;
  }, Ai.decode = function(o, f, h) {
    var m = o.length, p = 0, A = 0, M, v;
    do {
      if (f >= m)
        throw new Error("Expected more digits in base 64 VLQ value.");
      if (v = e.decode(o.charCodeAt(f++)), v === -1)
        throw new Error("Invalid base64 digit: " + o.charAt(f - 1));
      M = !!(v & i), v &= r, p = p + (v << A), A += t;
    } while (M);
    h.value = u(p), h.rest = f;
  }, Ai;
}
var Gs = {}, xo;
function ui() {
  return xo || (xo = 1, function(e) {
    function t(S, x, B) {
      if (x in S)
        return S[x];
      if (arguments.length === 3)
        return B;
      throw new Error('"' + x + '" is a required argument.');
    }
    e.getArg = t;
    var n = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, r = /^data:.+\,.+$/;
    function i(S) {
      var x = S.match(n);
      return x ? {
        scheme: x[1],
        auth: x[2],
        host: x[3],
        port: x[4],
        path: x[5]
      } : null;
    }
    e.urlParse = i;
    function s(S) {
      var x = "";
      return S.scheme && (x += S.scheme + ":"), x += "//", S.auth && (x += S.auth + "@"), S.host && (x += S.host), S.port && (x += ":" + S.port), S.path && (x += S.path), x;
    }
    e.urlGenerate = s;
    function u(S) {
      var x = S, B = i(S);
      if (B) {
        if (!B.path)
          return S;
        x = B.path;
      }
      for (var I = e.isAbsolute(x), V = x.split(/\/+/), q, X = 0, U = V.length - 1; U >= 0; U--)
        q = V[U], q === "." ? V.splice(U, 1) : q === ".." ? X++ : X > 0 && (q === "" ? (V.splice(U + 1, X), X = 0) : (V.splice(U, 2), X--));
      return x = V.join("/"), x === "" && (x = I ? "/" : "."), B ? (B.path = x, s(B)) : x;
    }
    e.normalize = u;
    function a(S, x) {
      S === "" && (S = "."), x === "" && (x = ".");
      var B = i(x), I = i(S);
      if (I && (S = I.path || "/"), B && !B.scheme)
        return I && (B.scheme = I.scheme), s(B);
      if (B || x.match(r))
        return x;
      if (I && !I.host && !I.path)
        return I.host = x, s(I);
      var V = x.charAt(0) === "/" ? x : u(S.replace(/\/+$/, "") + "/" + x);
      return I ? (I.path = V, s(I)) : V;
    }
    e.join = a, e.isAbsolute = function(S) {
      return S.charAt(0) === "/" || n.test(S);
    };
    function o(S, x) {
      S === "" && (S = "."), S = S.replace(/\/$/, "");
      for (var B = 0; x.indexOf(S + "/") !== 0; ) {
        var I = S.lastIndexOf("/");
        if (I < 0 || (S = S.slice(0, I), S.match(/^([^\/]+:\/)?\/*$/)))
          return x;
        ++B;
      }
      return Array(B + 1).join("../") + x.substr(S.length + 1);
    }
    e.relative = o;
    var f = function() {
      var S = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in S);
    }();
    function h(S) {
      return S;
    }
    function m(S) {
      return A(S) ? "$" + S : S;
    }
    e.toSetString = f ? h : m;
    function p(S) {
      return A(S) ? S.slice(1) : S;
    }
    e.fromSetString = f ? h : p;
    function A(S) {
      if (!S)
        return !1;
      var x = S.length;
      if (x < 9 || S.charCodeAt(x - 1) !== 95 || S.charCodeAt(x - 2) !== 95 || S.charCodeAt(x - 3) !== 111 || S.charCodeAt(x - 4) !== 116 || S.charCodeAt(x - 5) !== 111 || S.charCodeAt(x - 6) !== 114 || S.charCodeAt(x - 7) !== 112 || S.charCodeAt(x - 8) !== 95 || S.charCodeAt(x - 9) !== 95)
        return !1;
      for (var B = x - 10; B >= 0; B--)
        if (S.charCodeAt(B) !== 36)
          return !1;
      return !0;
    }
    function M(S, x, B) {
      var I = E(S.source, x.source);
      return I !== 0 || (I = S.originalLine - x.originalLine, I !== 0) || (I = S.originalColumn - x.originalColumn, I !== 0 || B) || (I = S.generatedColumn - x.generatedColumn, I !== 0) || (I = S.generatedLine - x.generatedLine, I !== 0) ? I : E(S.name, x.name);
    }
    e.compareByOriginalPositions = M;
    function v(S, x, B) {
      var I = S.generatedLine - x.generatedLine;
      return I !== 0 || (I = S.generatedColumn - x.generatedColumn, I !== 0 || B) || (I = E(S.source, x.source), I !== 0) || (I = S.originalLine - x.originalLine, I !== 0) || (I = S.originalColumn - x.originalColumn, I !== 0) ? I : E(S.name, x.name);
    }
    e.compareByGeneratedPositionsDeflated = v;
    function E(S, x) {
      return S === x ? 0 : S === null ? 1 : x === null ? -1 : S > x ? 1 : -1;
    }
    function k(S, x) {
      var B = S.generatedLine - x.generatedLine;
      return B !== 0 || (B = S.generatedColumn - x.generatedColumn, B !== 0) || (B = E(S.source, x.source), B !== 0) || (B = S.originalLine - x.originalLine, B !== 0) || (B = S.originalColumn - x.originalColumn, B !== 0) ? B : E(S.name, x.name);
    }
    e.compareByGeneratedPositionsInflated = k;
    function _(S) {
      return JSON.parse(S.replace(/^\)]}'[^\n]*\n/, ""));
    }
    e.parseSourceMapInput = _;
    function G(S, x, B) {
      if (x = x || "", S && (S[S.length - 1] !== "/" && x[0] !== "/" && (S += "/"), x = S + x), B) {
        var I = i(B);
        if (!I)
          throw new Error("sourceMapURL could not be parsed");
        if (I.path) {
          var V = I.path.lastIndexOf("/");
          V >= 0 && (I.path = I.path.substring(0, V + 1));
        }
        x = a(s(I), x);
      }
      return u(x);
    }
    e.computeSourceURL = G;
  }(Gs)), Gs;
}
var Xs = {}, wo;
function Fm() {
  if (wo) return Xs;
  wo = 1;
  var e = ui(), t = Object.prototype.hasOwnProperty, n = typeof Map < "u";
  function r() {
    this._array = [], this._set = n ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
  }
  return r.fromArray = function(s, u) {
    for (var a = new r(), o = 0, f = s.length; o < f; o++)
      a.add(s[o], u);
    return a;
  }, r.prototype.size = function() {
    return n ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  }, r.prototype.add = function(s, u) {
    var a = n ? s : e.toSetString(s), o = n ? this.has(s) : t.call(this._set, a), f = this._array.length;
    (!o || u) && this._array.push(s), o || (n ? this._set.set(s, f) : this._set[a] = f);
  }, r.prototype.has = function(s) {
    if (n)
      return this._set.has(s);
    var u = e.toSetString(s);
    return t.call(this._set, u);
  }, r.prototype.indexOf = function(s) {
    if (n) {
      var u = this._set.get(s);
      if (u >= 0)
        return u;
    } else {
      var a = e.toSetString(s);
      if (t.call(this._set, a))
        return this._set[a];
    }
    throw new Error('"' + s + '" is not in the set.');
  }, r.prototype.at = function(s) {
    if (s >= 0 && s < this._array.length)
      return this._array[s];
    throw new Error("No element indexed by " + s);
  }, r.prototype.toArray = function() {
    return this._array.slice();
  }, Xs.ArraySet = r, Xs;
}
var Zs = {}, So;
function Uv() {
  if (So) return Zs;
  So = 1;
  var e = ui();
  function t(r, i) {
    var s = r.generatedLine, u = i.generatedLine, a = r.generatedColumn, o = i.generatedColumn;
    return u > s || u == s && o >= a || e.compareByGeneratedPositionsInflated(r, i) <= 0;
  }
  function n() {
    this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
  }
  return n.prototype.unsortedForEach = function(i, s) {
    this._array.forEach(i, s);
  }, n.prototype.add = function(i) {
    t(this._last, i) ? (this._last = i, this._array.push(i)) : (this._sorted = !1, this._array.push(i));
  }, n.prototype.toArray = function() {
    return this._sorted || (this._array.sort(e.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
  }, Zs.MappingList = n, Zs;
}
var Bo;
function Em() {
  if (Bo) return Rs;
  Bo = 1;
  var e = Dm(), t = ui(), n = Fm().ArraySet, r = Uv().MappingList;
  function i(s) {
    s || (s = {}), this._file = t.getArg(s, "file", null), this._sourceRoot = t.getArg(s, "sourceRoot", null), this._skipValidation = t.getArg(s, "skipValidation", !1), this._sources = new n(), this._names = new n(), this._mappings = new r(), this._sourcesContents = null;
  }
  return i.prototype._version = 3, i.fromSourceMap = function(u) {
    var a = u.sourceRoot, o = new i({
      file: u.file,
      sourceRoot: a
    });
    return u.eachMapping(function(f) {
      var h = {
        generated: {
          line: f.generatedLine,
          column: f.generatedColumn
        }
      };
      f.source != null && (h.source = f.source, a != null && (h.source = t.relative(a, h.source)), h.original = {
        line: f.originalLine,
        column: f.originalColumn
      }, f.name != null && (h.name = f.name)), o.addMapping(h);
    }), u.sources.forEach(function(f) {
      var h = f;
      a !== null && (h = t.relative(a, f)), o._sources.has(h) || o._sources.add(h);
      var m = u.sourceContentFor(f);
      m != null && o.setSourceContent(f, m);
    }), o;
  }, i.prototype.addMapping = function(u) {
    var a = t.getArg(u, "generated"), o = t.getArg(u, "original", null), f = t.getArg(u, "source", null), h = t.getArg(u, "name", null);
    this._skipValidation || this._validateMapping(a, o, f, h), f != null && (f = String(f), this._sources.has(f) || this._sources.add(f)), h != null && (h = String(h), this._names.has(h) || this._names.add(h)), this._mappings.add({
      generatedLine: a.line,
      generatedColumn: a.column,
      originalLine: o != null && o.line,
      originalColumn: o != null && o.column,
      source: f,
      name: h
    });
  }, i.prototype.setSourceContent = function(u, a) {
    var o = u;
    this._sourceRoot != null && (o = t.relative(this._sourceRoot, o)), a != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[t.toSetString(o)] = a) : this._sourcesContents && (delete this._sourcesContents[t.toSetString(o)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
  }, i.prototype.applySourceMap = function(u, a, o) {
    var f = a;
    if (a == null) {
      if (u.file == null)
        throw new Error(
          `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
        );
      f = u.file;
    }
    var h = this._sourceRoot;
    h != null && (f = t.relative(h, f));
    var m = new n(), p = new n();
    this._mappings.unsortedForEach(function(A) {
      if (A.source === f && A.originalLine != null) {
        var M = u.originalPositionFor({
          line: A.originalLine,
          column: A.originalColumn
        });
        M.source != null && (A.source = M.source, o != null && (A.source = t.join(o, A.source)), h != null && (A.source = t.relative(h, A.source)), A.originalLine = M.line, A.originalColumn = M.column, M.name != null && (A.name = M.name));
      }
      var v = A.source;
      v != null && !m.has(v) && m.add(v);
      var E = A.name;
      E != null && !p.has(E) && p.add(E);
    }, this), this._sources = m, this._names = p, u.sources.forEach(function(A) {
      var M = u.sourceContentFor(A);
      M != null && (o != null && (A = t.join(o, A)), h != null && (A = t.relative(h, A)), this.setSourceContent(A, M));
    }, this);
  }, i.prototype._validateMapping = function(u, a, o, f) {
    if (a && typeof a.line != "number" && typeof a.column != "number")
      throw new Error(
        "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values."
      );
    if (!(u && "line" in u && "column" in u && u.line > 0 && u.column >= 0 && !a && !o && !f)) {
      if (u && "line" in u && "column" in u && a && "line" in a && "column" in a && u.line > 0 && u.column >= 0 && a.line > 0 && a.column >= 0 && o)
        return;
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: u,
        source: o,
        original: a,
        name: f
      }));
    }
  }, i.prototype._serializeMappings = function() {
    for (var u = 0, a = 1, o = 0, f = 0, h = 0, m = 0, p = "", A, M, v, E, k = this._mappings.toArray(), _ = 0, G = k.length; _ < G; _++) {
      if (M = k[_], A = "", M.generatedLine !== a)
        for (u = 0; M.generatedLine !== a; )
          A += ";", a++;
      else if (_ > 0) {
        if (!t.compareByGeneratedPositionsInflated(M, k[_ - 1]))
          continue;
        A += ",";
      }
      A += e.encode(M.generatedColumn - u), u = M.generatedColumn, M.source != null && (E = this._sources.indexOf(M.source), A += e.encode(E - m), m = E, A += e.encode(M.originalLine - 1 - f), f = M.originalLine - 1, A += e.encode(M.originalColumn - o), o = M.originalColumn, M.name != null && (v = this._names.indexOf(M.name), A += e.encode(v - h), h = v)), p += A;
    }
    return p;
  }, i.prototype._generateSourcesContent = function(u, a) {
    return u.map(function(o) {
      if (!this._sourcesContents)
        return null;
      a != null && (o = t.relative(a, o));
      var f = t.toSetString(o);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, f) ? this._sourcesContents[f] : null;
    }, this);
  }, i.prototype.toJSON = function() {
    var u = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    return this._file != null && (u.file = this._file), this._sourceRoot != null && (u.sourceRoot = this._sourceRoot), this._sourcesContents && (u.sourcesContent = this._generateSourcesContent(u.sources, u.sourceRoot)), u;
  }, i.prototype.toString = function() {
    return JSON.stringify(this.toJSON());
  }, Rs.SourceMapGenerator = i, Rs;
}
var Gr = {}, Ws = {}, _o;
function Qv() {
  return _o || (_o = 1, function(e) {
    e.GREATEST_LOWER_BOUND = 1, e.LEAST_UPPER_BOUND = 2;
    function t(n, r, i, s, u, a) {
      var o = Math.floor((r - n) / 2) + n, f = u(i, s[o], !0);
      return f === 0 ? o : f > 0 ? r - o > 1 ? t(o, r, i, s, u, a) : a == e.LEAST_UPPER_BOUND ? r < s.length ? r : -1 : o : o - n > 1 ? t(n, o, i, s, u, a) : a == e.LEAST_UPPER_BOUND ? o : n < 0 ? -1 : n;
    }
    e.search = function(r, i, s, u) {
      if (i.length === 0)
        return -1;
      var a = t(
        -1,
        i.length,
        r,
        i,
        s,
        u || e.GREATEST_LOWER_BOUND
      );
      if (a < 0)
        return -1;
      for (; a - 1 >= 0 && s(i[a], i[a - 1], !0) === 0; )
        --a;
      return a;
    };
  }(Ws)), Ws;
}
var Os = {}, ko;
function eP() {
  if (ko) return Os;
  ko = 1;
  function e(r, i, s) {
    var u = r[i];
    r[i] = r[s], r[s] = u;
  }
  function t(r, i) {
    return Math.round(r + Math.random() * (i - r));
  }
  function n(r, i, s, u) {
    if (s < u) {
      var a = t(s, u), o = s - 1;
      e(r, a, u);
      for (var f = r[u], h = s; h < u; h++)
        i(r[h], f) <= 0 && (o += 1, e(r, o, h));
      e(r, o + 1, h);
      var m = o + 1;
      n(r, i, s, m - 1), n(r, i, m + 1, u);
    }
  }
  return Os.quickSort = function(r, i) {
    n(r, i, 0, r.length - 1);
  }, Os;
}
var Io;
function tP() {
  if (Io) return Gr;
  Io = 1;
  var e = ui(), t = Qv(), n = Fm().ArraySet, r = Dm(), i = eP().quickSort;
  function s(f, h) {
    var m = f;
    return typeof f == "string" && (m = e.parseSourceMapInput(f)), m.sections != null ? new o(m, h) : new u(m, h);
  }
  s.fromSourceMap = function(f, h) {
    return u.fromSourceMap(f, h);
  }, s.prototype._version = 3, s.prototype.__generatedMappings = null, Object.defineProperty(s.prototype, "_generatedMappings", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.__generatedMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__generatedMappings;
    }
  }), s.prototype.__originalMappings = null, Object.defineProperty(s.prototype, "_originalMappings", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.__originalMappings || this._parseMappings(this._mappings, this.sourceRoot), this.__originalMappings;
    }
  }), s.prototype._charIsMappingSeparator = function(h, m) {
    var p = h.charAt(m);
    return p === ";" || p === ",";
  }, s.prototype._parseMappings = function(h, m) {
    throw new Error("Subclasses must implement _parseMappings");
  }, s.GENERATED_ORDER = 1, s.ORIGINAL_ORDER = 2, s.GREATEST_LOWER_BOUND = 1, s.LEAST_UPPER_BOUND = 2, s.prototype.eachMapping = function(h, m, p) {
    var A = m || null, M = p || s.GENERATED_ORDER, v;
    switch (M) {
      case s.GENERATED_ORDER:
        v = this._generatedMappings;
        break;
      case s.ORIGINAL_ORDER:
        v = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var E = this.sourceRoot;
    v.map(function(k) {
      var _ = k.source === null ? null : this._sources.at(k.source);
      return _ = e.computeSourceURL(E, _, this._sourceMapURL), {
        source: _,
        generatedLine: k.generatedLine,
        generatedColumn: k.generatedColumn,
        originalLine: k.originalLine,
        originalColumn: k.originalColumn,
        name: k.name === null ? null : this._names.at(k.name)
      };
    }, this).forEach(h, A);
  }, s.prototype.allGeneratedPositionsFor = function(h) {
    var m = e.getArg(h, "line"), p = {
      source: e.getArg(h, "source"),
      originalLine: m,
      originalColumn: e.getArg(h, "column", 0)
    };
    if (p.source = this._findSourceIndex(p.source), p.source < 0)
      return [];
    var A = [], M = this._findMapping(
      p,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      e.compareByOriginalPositions,
      t.LEAST_UPPER_BOUND
    );
    if (M >= 0) {
      var v = this._originalMappings[M];
      if (h.column === void 0)
        for (var E = v.originalLine; v && v.originalLine === E; )
          A.push({
            line: e.getArg(v, "generatedLine", null),
            column: e.getArg(v, "generatedColumn", null),
            lastColumn: e.getArg(v, "lastGeneratedColumn", null)
          }), v = this._originalMappings[++M];
      else
        for (var k = v.originalColumn; v && v.originalLine === m && v.originalColumn == k; )
          A.push({
            line: e.getArg(v, "generatedLine", null),
            column: e.getArg(v, "generatedColumn", null),
            lastColumn: e.getArg(v, "lastGeneratedColumn", null)
          }), v = this._originalMappings[++M];
    }
    return A;
  }, Gr.SourceMapConsumer = s;
  function u(f, h) {
    var m = f;
    typeof f == "string" && (m = e.parseSourceMapInput(f));
    var p = e.getArg(m, "version"), A = e.getArg(m, "sources"), M = e.getArg(m, "names", []), v = e.getArg(m, "sourceRoot", null), E = e.getArg(m, "sourcesContent", null), k = e.getArg(m, "mappings"), _ = e.getArg(m, "file", null);
    if (p != this._version)
      throw new Error("Unsupported version: " + p);
    v && (v = e.normalize(v)), A = A.map(String).map(e.normalize).map(function(G) {
      return v && e.isAbsolute(v) && e.isAbsolute(G) ? e.relative(v, G) : G;
    }), this._names = n.fromArray(M.map(String), !0), this._sources = n.fromArray(A, !0), this._absoluteSources = this._sources.toArray().map(function(G) {
      return e.computeSourceURL(v, G, h);
    }), this.sourceRoot = v, this.sourcesContent = E, this._mappings = k, this._sourceMapURL = h, this.file = _;
  }
  u.prototype = Object.create(s.prototype), u.prototype.consumer = s, u.prototype._findSourceIndex = function(f) {
    var h = f;
    if (this.sourceRoot != null && (h = e.relative(this.sourceRoot, h)), this._sources.has(h))
      return this._sources.indexOf(h);
    var m;
    for (m = 0; m < this._absoluteSources.length; ++m)
      if (this._absoluteSources[m] == f)
        return m;
    return -1;
  }, u.fromSourceMap = function(h, m) {
    var p = Object.create(u.prototype), A = p._names = n.fromArray(h._names.toArray(), !0), M = p._sources = n.fromArray(h._sources.toArray(), !0);
    p.sourceRoot = h._sourceRoot, p.sourcesContent = h._generateSourcesContent(
      p._sources.toArray(),
      p.sourceRoot
    ), p.file = h._file, p._sourceMapURL = m, p._absoluteSources = p._sources.toArray().map(function(B) {
      return e.computeSourceURL(p.sourceRoot, B, m);
    });
    for (var v = h._mappings.toArray().slice(), E = p.__generatedMappings = [], k = p.__originalMappings = [], _ = 0, G = v.length; _ < G; _++) {
      var S = v[_], x = new a();
      x.generatedLine = S.generatedLine, x.generatedColumn = S.generatedColumn, S.source && (x.source = M.indexOf(S.source), x.originalLine = S.originalLine, x.originalColumn = S.originalColumn, S.name && (x.name = A.indexOf(S.name)), k.push(x)), E.push(x);
    }
    return i(p.__originalMappings, e.compareByOriginalPositions), p;
  }, u.prototype._version = 3, Object.defineProperty(u.prototype, "sources", {
    get: function() {
      return this._absoluteSources.slice();
    }
  });
  function a() {
    this.generatedLine = 0, this.generatedColumn = 0, this.source = null, this.originalLine = null, this.originalColumn = null, this.name = null;
  }
  u.prototype._parseMappings = function(h, m) {
    for (var p = 1, A = 0, M = 0, v = 0, E = 0, k = 0, _ = h.length, G = 0, S = {}, x = {}, B = [], I = [], V, q, X, U, O; G < _; )
      if (h.charAt(G) === ";")
        p++, G++, A = 0;
      else if (h.charAt(G) === ",")
        G++;
      else {
        for (V = new a(), V.generatedLine = p, U = G; U < _ && !this._charIsMappingSeparator(h, U); U++)
          ;
        if (q = h.slice(G, U), X = S[q], X)
          G += q.length;
        else {
          for (X = []; G < U; )
            r.decode(h, G, x), O = x.value, G = x.rest, X.push(O);
          if (X.length === 2)
            throw new Error("Found a source, but no line and column");
          if (X.length === 3)
            throw new Error("Found a source and line, but no column");
          S[q] = X;
        }
        V.generatedColumn = A + X[0], A = V.generatedColumn, X.length > 1 && (V.source = E + X[1], E += X[1], V.originalLine = M + X[2], M = V.originalLine, V.originalLine += 1, V.originalColumn = v + X[3], v = V.originalColumn, X.length > 4 && (V.name = k + X[4], k += X[4])), I.push(V), typeof V.originalLine == "number" && B.push(V);
      }
    i(I, e.compareByGeneratedPositionsDeflated), this.__generatedMappings = I, i(B, e.compareByOriginalPositions), this.__originalMappings = B;
  }, u.prototype._findMapping = function(h, m, p, A, M, v) {
    if (h[p] <= 0)
      throw new TypeError("Line must be greater than or equal to 1, got " + h[p]);
    if (h[A] < 0)
      throw new TypeError("Column must be greater than or equal to 0, got " + h[A]);
    return t.search(h, m, M, v);
  }, u.prototype.computeColumnSpans = function() {
    for (var h = 0; h < this._generatedMappings.length; ++h) {
      var m = this._generatedMappings[h];
      if (h + 1 < this._generatedMappings.length) {
        var p = this._generatedMappings[h + 1];
        if (m.generatedLine === p.generatedLine) {
          m.lastGeneratedColumn = p.generatedColumn - 1;
          continue;
        }
      }
      m.lastGeneratedColumn = 1 / 0;
    }
  }, u.prototype.originalPositionFor = function(h) {
    var m = {
      generatedLine: e.getArg(h, "line"),
      generatedColumn: e.getArg(h, "column")
    }, p = this._findMapping(
      m,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      e.compareByGeneratedPositionsDeflated,
      e.getArg(h, "bias", s.GREATEST_LOWER_BOUND)
    );
    if (p >= 0) {
      var A = this._generatedMappings[p];
      if (A.generatedLine === m.generatedLine) {
        var M = e.getArg(A, "source", null);
        M !== null && (M = this._sources.at(M), M = e.computeSourceURL(this.sourceRoot, M, this._sourceMapURL));
        var v = e.getArg(A, "name", null);
        return v !== null && (v = this._names.at(v)), {
          source: M,
          line: e.getArg(A, "originalLine", null),
          column: e.getArg(A, "originalColumn", null),
          name: v
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  }, u.prototype.hasContentsOfAllSources = function() {
    return this.sourcesContent ? this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(h) {
      return h == null;
    }) : !1;
  }, u.prototype.sourceContentFor = function(h, m) {
    if (!this.sourcesContent)
      return null;
    var p = this._findSourceIndex(h);
    if (p >= 0)
      return this.sourcesContent[p];
    var A = h;
    this.sourceRoot != null && (A = e.relative(this.sourceRoot, A));
    var M;
    if (this.sourceRoot != null && (M = e.urlParse(this.sourceRoot))) {
      var v = A.replace(/^file:\/\//, "");
      if (M.scheme == "file" && this._sources.has(v))
        return this.sourcesContent[this._sources.indexOf(v)];
      if ((!M.path || M.path == "/") && this._sources.has("/" + A))
        return this.sourcesContent[this._sources.indexOf("/" + A)];
    }
    if (m)
      return null;
    throw new Error('"' + A + '" is not in the SourceMap.');
  }, u.prototype.generatedPositionFor = function(h) {
    var m = e.getArg(h, "source");
    if (m = this._findSourceIndex(m), m < 0)
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    var p = {
      source: m,
      originalLine: e.getArg(h, "line"),
      originalColumn: e.getArg(h, "column")
    }, A = this._findMapping(
      p,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      e.compareByOriginalPositions,
      e.getArg(h, "bias", s.GREATEST_LOWER_BOUND)
    );
    if (A >= 0) {
      var M = this._originalMappings[A];
      if (M.source === p.source)
        return {
          line: e.getArg(M, "generatedLine", null),
          column: e.getArg(M, "generatedColumn", null),
          lastColumn: e.getArg(M, "lastGeneratedColumn", null)
        };
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  }, Gr.BasicSourceMapConsumer = u;
  function o(f, h) {
    var m = f;
    typeof f == "string" && (m = e.parseSourceMapInput(f));
    var p = e.getArg(m, "version"), A = e.getArg(m, "sections");
    if (p != this._version)
      throw new Error("Unsupported version: " + p);
    this._sources = new n(), this._names = new n();
    var M = {
      line: -1,
      column: 0
    };
    this._sections = A.map(function(v) {
      if (v.url)
        throw new Error("Support for url field in sections not implemented.");
      var E = e.getArg(v, "offset"), k = e.getArg(E, "line"), _ = e.getArg(E, "column");
      if (k < M.line || k === M.line && _ < M.column)
        throw new Error("Section offsets must be ordered and non-overlapping.");
      return M = E, {
        generatedOffset: {
          // The offset fields are 0-based, but we use 1-based indices when
          // encoding/decoding from VLQ.
          generatedLine: k + 1,
          generatedColumn: _ + 1
        },
        consumer: new s(e.getArg(v, "map"), h)
      };
    });
  }
  return o.prototype = Object.create(s.prototype), o.prototype.constructor = s, o.prototype._version = 3, Object.defineProperty(o.prototype, "sources", {
    get: function() {
      for (var f = [], h = 0; h < this._sections.length; h++)
        for (var m = 0; m < this._sections[h].consumer.sources.length; m++)
          f.push(this._sections[h].consumer.sources[m]);
      return f;
    }
  }), o.prototype.originalPositionFor = function(h) {
    var m = {
      generatedLine: e.getArg(h, "line"),
      generatedColumn: e.getArg(h, "column")
    }, p = t.search(
      m,
      this._sections,
      function(M, v) {
        var E = M.generatedLine - v.generatedOffset.generatedLine;
        return E || M.generatedColumn - v.generatedOffset.generatedColumn;
      }
    ), A = this._sections[p];
    return A ? A.consumer.originalPositionFor({
      line: m.generatedLine - (A.generatedOffset.generatedLine - 1),
      column: m.generatedColumn - (A.generatedOffset.generatedLine === m.generatedLine ? A.generatedOffset.generatedColumn - 1 : 0),
      bias: h.bias
    }) : {
      source: null,
      line: null,
      column: null,
      name: null
    };
  }, o.prototype.hasContentsOfAllSources = function() {
    return this._sections.every(function(h) {
      return h.consumer.hasContentsOfAllSources();
    });
  }, o.prototype.sourceContentFor = function(h, m) {
    for (var p = 0; p < this._sections.length; p++) {
      var A = this._sections[p], M = A.consumer.sourceContentFor(h, !0);
      if (M)
        return M;
    }
    if (m)
      return null;
    throw new Error('"' + h + '" is not in the SourceMap.');
  }, o.prototype.generatedPositionFor = function(h) {
    for (var m = 0; m < this._sections.length; m++) {
      var p = this._sections[m];
      if (p.consumer._findSourceIndex(e.getArg(h, "source")) !== -1) {
        var A = p.consumer.generatedPositionFor(h);
        if (A) {
          var M = {
            line: A.line + (p.generatedOffset.generatedLine - 1),
            column: A.column + (p.generatedOffset.generatedLine === A.line ? p.generatedOffset.generatedColumn - 1 : 0)
          };
          return M;
        }
      }
    }
    return {
      line: null,
      column: null
    };
  }, o.prototype._parseMappings = function(h, m) {
    this.__generatedMappings = [], this.__originalMappings = [];
    for (var p = 0; p < this._sections.length; p++)
      for (var A = this._sections[p], M = A.consumer._generatedMappings, v = 0; v < M.length; v++) {
        var E = M[v], k = A.consumer._sources.at(E.source);
        k = e.computeSourceURL(A.consumer.sourceRoot, k, this._sourceMapURL), this._sources.add(k), k = this._sources.indexOf(k);
        var _ = null;
        E.name && (_ = A.consumer._names.at(E.name), this._names.add(_), _ = this._names.indexOf(_));
        var G = {
          source: k,
          generatedLine: E.generatedLine + (A.generatedOffset.generatedLine - 1),
          generatedColumn: E.generatedColumn + (A.generatedOffset.generatedLine === E.generatedLine ? A.generatedOffset.generatedColumn - 1 : 0),
          originalLine: E.originalLine,
          originalColumn: E.originalColumn,
          name: _
        };
        this.__generatedMappings.push(G), typeof G.originalLine == "number" && this.__originalMappings.push(G);
      }
    i(this.__generatedMappings, e.compareByGeneratedPositionsDeflated), i(this.__originalMappings, e.compareByOriginalPositions);
  }, Gr.IndexedSourceMapConsumer = o, Gr;
}
var zs = {}, Vo;
function nP() {
  if (Vo) return zs;
  Vo = 1;
  var e = Em().SourceMapGenerator, t = ui(), n = /(\r?\n)/, r = 10, i = "$$$isSourceNode$$$";
  function s(u, a, o, f, h) {
    this.children = [], this.sourceContents = {}, this.line = u ?? null, this.column = a ?? null, this.source = o ?? null, this.name = h ?? null, this[i] = !0, f != null && this.add(f);
  }
  return s.fromStringWithSourceMap = function(a, o, f) {
    var h = new s(), m = a.split(n), p = 0, A = function() {
      var _ = S(), G = S() || "";
      return _ + G;
      function S() {
        return p < m.length ? m[p++] : void 0;
      }
    }, M = 1, v = 0, E = null;
    return o.eachMapping(function(_) {
      if (E !== null)
        if (M < _.generatedLine)
          k(E, A()), M++, v = 0;
        else {
          var G = m[p] || "", S = G.substr(0, _.generatedColumn - v);
          m[p] = G.substr(_.generatedColumn - v), v = _.generatedColumn, k(E, S), E = _;
          return;
        }
      for (; M < _.generatedLine; )
        h.add(A()), M++;
      if (v < _.generatedColumn) {
        var G = m[p] || "";
        h.add(G.substr(0, _.generatedColumn)), m[p] = G.substr(_.generatedColumn), v = _.generatedColumn;
      }
      E = _;
    }, this), p < m.length && (E && k(E, A()), h.add(m.splice(p).join(""))), o.sources.forEach(function(_) {
      var G = o.sourceContentFor(_);
      G != null && (f != null && (_ = t.join(f, _)), h.setSourceContent(_, G));
    }), h;
    function k(_, G) {
      if (_ === null || _.source === void 0)
        h.add(G);
      else {
        var S = f ? t.join(f, _.source) : _.source;
        h.add(new s(
          _.originalLine,
          _.originalColumn,
          S,
          G,
          _.name
        ));
      }
    }
  }, s.prototype.add = function(a) {
    if (Array.isArray(a))
      a.forEach(function(o) {
        this.add(o);
      }, this);
    else if (a[i] || typeof a == "string")
      a && this.children.push(a);
    else
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + a
      );
    return this;
  }, s.prototype.prepend = function(a) {
    if (Array.isArray(a))
      for (var o = a.length - 1; o >= 0; o--)
        this.prepend(a[o]);
    else if (a[i] || typeof a == "string")
      this.children.unshift(a);
    else
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + a
      );
    return this;
  }, s.prototype.walk = function(a) {
    for (var o, f = 0, h = this.children.length; f < h; f++)
      o = this.children[f], o[i] ? o.walk(a) : o !== "" && a(o, {
        source: this.source,
        line: this.line,
        column: this.column,
        name: this.name
      });
  }, s.prototype.join = function(a) {
    var o, f, h = this.children.length;
    if (h > 0) {
      for (o = [], f = 0; f < h - 1; f++)
        o.push(this.children[f]), o.push(a);
      o.push(this.children[f]), this.children = o;
    }
    return this;
  }, s.prototype.replaceRight = function(a, o) {
    var f = this.children[this.children.length - 1];
    return f[i] ? f.replaceRight(a, o) : typeof f == "string" ? this.children[this.children.length - 1] = f.replace(a, o) : this.children.push("".replace(a, o)), this;
  }, s.prototype.setSourceContent = function(a, o) {
    this.sourceContents[t.toSetString(a)] = o;
  }, s.prototype.walkSourceContents = function(a) {
    for (var o = 0, f = this.children.length; o < f; o++)
      this.children[o][i] && this.children[o].walkSourceContents(a);
    for (var h = Object.keys(this.sourceContents), o = 0, f = h.length; o < f; o++)
      a(t.fromSetString(h[o]), this.sourceContents[h[o]]);
  }, s.prototype.toString = function() {
    var a = "";
    return this.walk(function(o) {
      a += o;
    }), a;
  }, s.prototype.toStringWithSourceMap = function(a) {
    var o = {
      code: "",
      line: 1,
      column: 0
    }, f = new e(a), h = !1, m = null, p = null, A = null, M = null;
    return this.walk(function(v, E) {
      o.code += v, E.source !== null && E.line !== null && E.column !== null ? ((m !== E.source || p !== E.line || A !== E.column || M !== E.name) && f.addMapping({
        source: E.source,
        original: {
          line: E.line,
          column: E.column
        },
        generated: {
          line: o.line,
          column: o.column
        },
        name: E.name
      }), m = E.source, p = E.line, A = E.column, M = E.name, h = !0) : h && (f.addMapping({
        generated: {
          line: o.line,
          column: o.column
        }
      }), m = null, h = !1);
      for (var k = 0, _ = v.length; k < _; k++)
        v.charCodeAt(k) === r ? (o.line++, o.column = 0, k + 1 === _ ? (m = null, h = !1) : h && f.addMapping({
          source: E.source,
          original: {
            line: E.line,
            column: E.column
          },
          generated: {
            line: o.line,
            column: o.column
          },
          name: E.name
        })) : o.column++;
    }), this.walkSourceContents(function(v, E) {
      f.setSourceContent(v, E);
    }), { code: o.code, map: f };
  }, zs.SourceNode = s, zs;
}
var No;
function rP() {
  return No || (No = 1, Rr.SourceMapGenerator = Em().SourceMapGenerator, Rr.SourceMapConsumer = tP().SourceMapConsumer, Rr.SourceNode = nP().SourceNode), Rr;
}
const iP = "escodegen", sP = "ECMAScript code generator", uP = "http://github.com/estools/escodegen", aP = "escodegen.js", oP = { esgenerate: "./bin/esgenerate.js", escodegen: "./bin/escodegen.js" }, cP = ["LICENSE.BSD", "README.md", "bin", "escodegen.js", "package.json"], lP = "2.1.0", fP = { node: ">=6.0" }, hP = [{ name: "Yusuke Suzuki", email: "utatane.tea@gmail.com", web: "http://github.com/Constellation" }], pP = { type: "git", url: "http://github.com/estools/escodegen.git" }, dP = { estraverse: "^5.2.0", esutils: "^2.0.2", esprima: "^4.0.1" }, mP = { "source-map": "~0.6.1" }, gP = { acorn: "^8.0.4", bluebird: "^3.4.7", "bower-registry-client": "^1.0.0", chai: "^4.2.0", "chai-exclude": "^2.0.2", "commonjs-everywhere": "^0.9.7", gulp: "^4.0.2", "gulp-eslint": "^6.0.0", "gulp-mocha": "^7.0.2", minimist: "^1.2.5", optionator: "^0.9.1", semver: "^7.3.4" }, yP = "BSD-2-Clause", bP = { test: "gulp travis", "unit-test": "gulp test", lint: "gulp lint", release: "node tools/release.js", "build-min": "./node_modules/.bin/cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js", build: "./node_modules/.bin/cjsify -a path: tools/entry-point.js > escodegen.browser.js" }, AP = {
  name: iP,
  description: sP,
  homepage: uP,
  main: aP,
  bin: oP,
  files: cP,
  version: lP,
  engines: fP,
  maintainers: hP,
  repository: pP,
  dependencies: dP,
  optionalDependencies: mP,
  devDependencies: gP,
  license: yP,
  scripts: bP
};
var To;
function MP() {
  return To || (To = 1, function(e) {
    (function() {
      var t, n, r, i, s, u, a, o, f, h, m, p, A, M, v, E, k, _, G, S, x, B, I, V, q, X;
      s = qv(), u = Jv(), t = s.Syntax;
      function U(c) {
        return Ne.Expression.hasOwnProperty(c.type);
      }
      function O(c) {
        return Ne.Statement.hasOwnProperty(c.type);
      }
      n = {
        Sequence: 0,
        Yield: 1,
        Assignment: 1,
        Conditional: 2,
        ArrowFunction: 2,
        Coalesce: 3,
        LogicalOR: 4,
        LogicalAND: 5,
        BitwiseOR: 6,
        BitwiseXOR: 7,
        BitwiseAND: 8,
        Equality: 9,
        Relational: 10,
        BitwiseSHIFT: 11,
        Additive: 12,
        Multiplicative: 13,
        Exponentiation: 14,
        Await: 15,
        Unary: 15,
        Postfix: 16,
        OptionalChaining: 17,
        Call: 18,
        New: 19,
        TaggedTemplate: 20,
        Member: 21,
        Primary: 22
      }, r = {
        "??": n.Coalesce,
        "||": n.LogicalOR,
        "&&": n.LogicalAND,
        "|": n.BitwiseOR,
        "^": n.BitwiseXOR,
        "&": n.BitwiseAND,
        "==": n.Equality,
        "!=": n.Equality,
        "===": n.Equality,
        "!==": n.Equality,
        is: n.Equality,
        isnt: n.Equality,
        "<": n.Relational,
        ">": n.Relational,
        "<=": n.Relational,
        ">=": n.Relational,
        in: n.Relational,
        instanceof: n.Relational,
        "<<": n.BitwiseSHIFT,
        ">>": n.BitwiseSHIFT,
        ">>>": n.BitwiseSHIFT,
        "+": n.Additive,
        "-": n.Additive,
        "*": n.Multiplicative,
        "%": n.Multiplicative,
        "/": n.Multiplicative,
        "**": n.Exponentiation
      };
      var W = 1, ee = 2, be = 4, pe = 8, le = 16, ie = 32, Ie = 64, oe = ee | be, ge = W | ee, $ = W | ee | be, Pe = W, it = be, ze = W | be, Ae = W, qe = W | ie, xe = 0, je = W | le, Ct = W | pe;
      function ut() {
        return {
          indent: null,
          base: null,
          parse: null,
          comment: !1,
          format: {
            indent: {
              style: "    ",
              base: 0,
              adjustMultilineComment: !1
            },
            newline: `
`,
            space: " ",
            json: !1,
            renumber: !1,
            hexadecimal: !1,
            quotes: "single",
            escapeless: !1,
            compact: !1,
            parentheses: !0,
            semicolons: !0,
            safeConcatenation: !1,
            preserveBlankLines: !1
          },
          moz: {
            comprehensionExpressionStartsWithAssignment: !1,
            starlessGenerator: !1
          },
          sourceMap: null,
          sourceMapRoot: null,
          sourceMapWithCode: !1,
          directive: !1,
          raw: !0,
          verbatim: null,
          sourceCode: null
        };
      }
      function Ve(c, g) {
        var d = "";
        for (g |= 0; g > 0; g >>>= 1, c += c)
          g & 1 && (d += c);
        return d;
      }
      function cn(c) {
        return /[\r\n]/g.test(c);
      }
      function _e(c) {
        var g = c.length;
        return g && u.code.isLineTerminator(c.charCodeAt(g - 1));
      }
      function Kt(c, g) {
        var d;
        for (d in g)
          g.hasOwnProperty(d) && (c[d] = g[d]);
        return c;
      }
      function Vt(c, g) {
        var d, y;
        function P(N) {
          return typeof N == "object" && N instanceof Object && !(N instanceof RegExp);
        }
        for (d in g)
          g.hasOwnProperty(d) && (y = g[d], P(y) ? P(c[d]) ? Vt(c[d], y) : c[d] = Vt({}, y) : c[d] = y);
        return c;
      }
      function Nt(c) {
        var g, d, y, P, N;
        if (c !== c)
          throw new Error("Numeric literal whose value is NaN");
        if (c < 0 || c === 0 && 1 / c < 0)
          throw new Error("Numeric literal whose value is negative");
        if (c === 1 / 0)
          return f ? "null" : h ? "1e400" : "1e+400";
        if (g = "" + c, !h || g.length < 3)
          return g;
        for (d = g.indexOf("."), !f && g.charCodeAt(0) === 48 && d === 1 && (d = 0, g = g.slice(1)), y = g, g = g.replace("e+", "e"), P = 0, (N = y.indexOf("e")) > 0 && (P = +y.slice(N + 1), y = y.slice(0, N)), d >= 0 && (P -= y.length - d - 1, y = +(y.slice(0, d) + y.slice(d + 1)) + ""), N = 0; y.charCodeAt(y.length + N - 1) === 48; )
          --N;
        return N !== 0 && (P -= N, y = y.slice(0, N)), P !== 0 && (y += "e" + P), (y.length < g.length || m && c > 1e12 && Math.floor(c) === c && (y = "0x" + c.toString(16)).length < g.length) && +y === c && (g = y), g;
      }
      function ln(c, g) {
        return (c & -2) === 8232 ? (g ? "u" : "\\u") + (c === 8232 ? "2028" : "2029") : c === 10 || c === 13 ? (g ? "" : "\\") + (c === 10 ? "n" : "r") : String.fromCharCode(c);
      }
      function Wn(c) {
        var g, d, y, P, N, R, Z, J;
        if (d = c.toString(), c.source) {
          if (g = d.match(/\/([^/]*)$/), !g)
            return d;
          for (y = g[1], d = "", Z = !1, J = !1, P = 0, N = c.source.length; P < N; ++P)
            R = c.source.charCodeAt(P), J ? (d += ln(R, J), J = !1) : (Z ? R === 93 && (Z = !1) : R === 47 ? d += "\\" : R === 91 && (Z = !0), d += ln(R, J), J = R === 92);
          return "/" + d + "/" + y;
        }
        return d;
      }
      function Ht(c, g) {
        var d;
        return c === 8 ? "\\b" : c === 12 ? "\\f" : c === 9 ? "\\t" : (d = c.toString(16).toUpperCase(), f || c > 255 ? "\\u" + "0000".slice(d.length) + d : c === 0 && !u.code.isDecimalDigit(g) ? "\\0" : c === 11 ? "\\x0B" : "\\x" + "00".slice(d.length) + d);
      }
      function fn(c) {
        if (c === 92)
          return "\\\\";
        if (c === 10)
          return "\\n";
        if (c === 13)
          return "\\r";
        if (c === 8232)
          return "\\u2028";
        if (c === 8233)
          return "\\u2029";
        throw new Error("Incorrectly classified character");
      }
      function Jt(c) {
        var g, d, y, P;
        for (P = p === "double" ? '"' : "'", g = 0, d = c.length; g < d; ++g)
          if (y = c.charCodeAt(g), y === 39) {
            P = '"';
            break;
          } else if (y === 34) {
            P = "'";
            break;
          } else y === 92 && ++g;
        return P + c + P;
      }
      function yt(c) {
        var g = "", d, y, P, N = 0, R = 0, Z, J;
        for (d = 0, y = c.length; d < y; ++d) {
          if (P = c.charCodeAt(d), P === 39)
            ++N;
          else if (P === 34)
            ++R;
          else if (P === 47 && f)
            g += "\\";
          else if (u.code.isLineTerminator(P) || P === 92) {
            g += fn(P);
            continue;
          } else if (!u.code.isIdentifierPartES5(P) && (f && P < 32 || !f && !A && (P < 32 || P > 126))) {
            g += Ht(P, c.charCodeAt(d + 1));
            continue;
          }
          g += String.fromCharCode(P);
        }
        if (Z = !(p === "double" || p === "auto" && R < N), J = Z ? "'" : '"', !(Z ? N : R))
          return J + g + J;
        for (c = g, g = J, d = 0, y = c.length; d < y; ++d)
          P = c.charCodeAt(d), (P === 39 && Z || P === 34 && !Z) && (g += "\\"), g += String.fromCharCode(P);
        return g + J;
      }
      function En(c) {
        var g, d, y, P = "";
        for (g = 0, d = c.length; g < d; ++g)
          y = c[g], P += Array.isArray(y) ? En(y) : y;
        return P;
      }
      function ye(c, g) {
        if (!B)
          return Array.isArray(c) ? En(c) : c;
        if (g == null) {
          if (c instanceof i)
            return c;
          g = {};
        }
        return g.loc == null ? new i(null, null, B, c, g.name || null) : new i(g.loc.start.line, g.loc.start.column, B === !0 ? g.loc.source || null : B, c, g.name || null);
      }
      function Ze() {
        return v || " ";
      }
      function ue(c, g) {
        var d, y, P, N;
        return d = ye(c).toString(), d.length === 0 ? [g] : (y = ye(g).toString(), y.length === 0 ? [c] : (P = d.charCodeAt(d.length - 1), N = y.charCodeAt(0), (P === 43 || P === 45) && P === N || u.code.isIdentifierPartES5(P) && u.code.isIdentifierPartES5(N) || P === 47 && N === 105 ? [c, Ze(), g] : u.code.isWhiteSpace(P) || u.code.isLineTerminator(P) || u.code.isWhiteSpace(N) || u.code.isLineTerminator(N) ? [c, g] : [c, v, g]));
      }
      function We(c) {
        return [a, c];
      }
      function ke(c) {
        var g;
        g = a, a += o, c(a), a = g;
      }
      function xn(c) {
        var g;
        for (g = c.length - 1; g >= 0 && !u.code.isLineTerminator(c.charCodeAt(g)); --g)
          ;
        return c.length - 1 - g;
      }
      function _r(c, g) {
        var d, y, P, N, R, Z, J, Ce;
        for (d = c.split(/\r\n|[\r\n]/), Z = Number.MAX_VALUE, y = 1, P = d.length; y < P; ++y) {
          for (N = d[y], R = 0; R < N.length && u.code.isWhiteSpace(N.charCodeAt(R)); )
            ++R;
          Z > R && (Z = R);
        }
        for (typeof g < "u" ? (J = a, d[1][Z] === "*" && (g += " "), a = g) : (Z & 1 && --Z, J = a), y = 1, P = d.length; y < P; ++y)
          Ce = ye(We(d[y].slice(Z))), d[y] = B ? Ce.join("") : Ce;
        return a = J, d.join(`
`);
      }
      function ct(c, g) {
        if (c.type === "Line") {
          if (_e(c.value))
            return "//" + c.value;
          var d = "//" + c.value;
          return V || (d += `
`), d;
        }
        return S.format.indent.adjustMultilineComment && /[\n\r]/.test(c.value) ? _r("/*" + c.value + "*/", g) : "/*" + c.value + "*/";
      }
      function Tt(c, g) {
        var d, y, P, N, R, Z, J, Ce, Oe, dn, wn, ci, li, Pt;
        if (c.leadingComments && c.leadingComments.length > 0) {
          if (N = g, V) {
            for (P = c.leadingComments[0], g = [], Ce = P.extendedRange, Oe = P.range, wn = I.substring(Ce[0], Oe[0]), Pt = (wn.match(/\n/g) || []).length, Pt > 0 ? (g.push(Ve(`
`, Pt)), g.push(We(ct(P)))) : (g.push(wn), g.push(ct(P))), dn = Oe, d = 1, y = c.leadingComments.length; d < y; d++)
              P = c.leadingComments[d], Oe = P.range, ci = I.substring(dn[1], Oe[0]), Pt = (ci.match(/\n/g) || []).length, g.push(Ve(`
`, Pt)), g.push(We(ct(P))), dn = Oe;
            li = I.substring(Oe[1], Ce[1]), Pt = (li.match(/\n/g) || []).length, g.push(Ve(`
`, Pt));
          } else
            for (P = c.leadingComments[0], g = [], _ && c.type === t.Program && c.body.length === 0 && g.push(`
`), g.push(ct(P)), _e(ye(g).toString()) || g.push(`
`), d = 1, y = c.leadingComments.length; d < y; ++d)
              P = c.leadingComments[d], J = [ct(P)], _e(ye(J).toString()) || J.push(`
`), g.push(We(J));
          g.push(We(N));
        }
        if (c.trailingComments)
          if (V)
            P = c.trailingComments[0], Ce = P.extendedRange, Oe = P.range, wn = I.substring(Ce[0], Oe[0]), Pt = (wn.match(/\n/g) || []).length, Pt > 0 ? (g.push(Ve(`
`, Pt)), g.push(We(ct(P)))) : (g.push(wn), g.push(ct(P)));
          else
            for (R = !_e(ye(g).toString()), Z = Ve(" ", xn(ye([a, g, o]).toString())), d = 0, y = c.trailingComments.length; d < y; ++d)
              P = c.trailingComments[d], R ? (d === 0 ? g = [g, o] : g = [g, Z], g.push(ct(P, Z))) : g = [g, We(ct(P))], d !== y - 1 && !_e(ye(g).toString()) && (g = [g, `
`]);
        return g;
      }
      function bt(c, g, d) {
        var y, P = 0;
        for (y = c; y < g; y++)
          I[y] === `
` && P++;
        for (y = 1; y < P; y++)
          d.push(M);
      }
      function fe(c, g, d) {
        return g < d ? ["(", c, ")"] : c;
      }
      function hn(c) {
        var g, d, y;
        for (y = c.split(/\r\n|\n/), g = 1, d = y.length; g < d; g++)
          y[g] = M + a + y[g];
        return y;
      }
      function pn(c, g) {
        var d, y, P;
        return d = c[S.verbatim], typeof d == "string" ? y = fe(hn(d), n.Sequence, g) : (y = hn(d.content), P = d.precedence != null ? d.precedence : n.Sequence, y = fe(y, P, g)), ye(y, c);
      }
      function Ne() {
      }
      Ne.prototype.maybeBlock = function(c, g) {
        var d, y, P = this;
        return y = !S.comment || !c.leadingComments, c.type === t.BlockStatement && y ? [v, this.generateStatement(c, g)] : c.type === t.EmptyStatement && y ? ";" : (ke(function() {
          d = [
            M,
            We(P.generateStatement(c, g))
          ];
        }), d);
      }, Ne.prototype.maybeBlockSuffix = function(c, g) {
        var d = _e(ye(g).toString());
        return c.type === t.BlockStatement && (!S.comment || !c.leadingComments) && !d ? [g, v] : d ? [g, a] : [g, M, a];
      };
      function Qe(c) {
        return ye(c.name, c);
      }
      function Yt(c, g) {
        return c.async ? "async" + (g ? Ze() : v) : "";
      }
      function Me(c) {
        var g = c.generator && !S.moz.starlessGenerator;
        return g ? "*" + v : "";
      }
      function vt(c) {
        var g = c.value, d = "";
        return g.async && (d += Yt(g, !c.computed)), g.generator && (d += Me(g) ? "*" : ""), d;
      }
      Ne.prototype.generatePattern = function(c, g, d) {
        return c.type === t.Identifier ? Qe(c) : this.generateExpression(c, g, d);
      }, Ne.prototype.generateFunctionParams = function(c) {
        var g, d, y, P;
        if (P = !1, c.type === t.ArrowFunctionExpression && !c.rest && (!c.defaults || c.defaults.length === 0) && c.params.length === 1 && c.params[0].type === t.Identifier)
          y = [Yt(c, !0), Qe(c.params[0])];
        else {
          for (y = c.type === t.ArrowFunctionExpression ? [Yt(c, !1)] : [], y.push("("), c.defaults && (P = !0), g = 0, d = c.params.length; g < d; ++g)
            P && c.defaults[g] ? y.push(this.generateAssignment(c.params[g], c.defaults[g], "=", n.Assignment, $)) : y.push(this.generatePattern(c.params[g], n.Assignment, $)), g + 1 < d && y.push("," + v);
          c.rest && (c.params.length && y.push("," + v), y.push("..."), y.push(Qe(c.rest))), y.push(")");
        }
        return y;
      }, Ne.prototype.generateFunctionBody = function(c) {
        var g, d;
        return g = this.generateFunctionParams(c), c.type === t.ArrowFunctionExpression && (g.push(v), g.push("=>")), c.expression ? (g.push(v), d = this.generateExpression(c.body, n.Assignment, $), d.toString().charAt(0) === "{" && (d = ["(", d, ")"]), g.push(d)) : g.push(this.maybeBlock(c.body, Ct)), g;
      }, Ne.prototype.generateIterationForStatement = function(c, g, d) {
        var y = ["for" + (g.await ? Ze() + "await" : "") + v + "("], P = this;
        return ke(function() {
          g.left.type === t.VariableDeclaration ? ke(function() {
            y.push(g.left.kind + Ze()), y.push(P.generateStatement(g.left.declarations[0], xe));
          }) : y.push(P.generateExpression(g.left, n.Call, $)), y = ue(y, c), y = [ue(
            y,
            P.generateExpression(g.right, n.Assignment, $)
          ), ")"];
        }), y.push(this.maybeBlock(g.body, d)), y;
      }, Ne.prototype.generatePropertyKey = function(c, g) {
        var d = [];
        return g && d.push("["), d.push(this.generateExpression(c, n.Assignment, $)), g && d.push("]"), d;
      }, Ne.prototype.generateAssignment = function(c, g, d, y, P) {
        return n.Assignment < y && (P |= W), fe(
          [
            this.generateExpression(c, n.Call, P),
            v + d + v,
            this.generateExpression(g, n.Assignment, P)
          ],
          n.Assignment,
          y
        );
      }, Ne.prototype.semicolon = function(c) {
        return !k && c & ie ? "" : ";";
      }, Ne.Statement = {
        BlockStatement: function(c, g) {
          var d, y, P = ["{", M], N = this;
          return ke(function() {
            c.body.length === 0 && V && (d = c.range, d[1] - d[0] > 2 && (y = I.substring(d[0] + 1, d[1] - 1), y[0] === `
` && (P = ["{"]), P.push(y)));
            var R, Z, J, Ce;
            for (Ce = Ae, g & pe && (Ce |= le), R = 0, Z = c.body.length; R < Z; ++R)
              V && (R === 0 && (c.body[0].leadingComments && (d = c.body[0].leadingComments[0].extendedRange, y = I.substring(d[0], d[1]), y[0] === `
` && (P = ["{"])), c.body[0].leadingComments || bt(c.range[0], c.body[0].range[0], P)), R > 0 && !c.body[R - 1].trailingComments && !c.body[R].leadingComments && bt(c.body[R - 1].range[1], c.body[R].range[0], P)), R === Z - 1 && (Ce |= ie), c.body[R].leadingComments && V ? J = N.generateStatement(c.body[R], Ce) : J = We(N.generateStatement(c.body[R], Ce)), P.push(J), _e(ye(J).toString()) || V && R < Z - 1 && c.body[R + 1].leadingComments || P.push(M), V && R === Z - 1 && (c.body[R].trailingComments || bt(c.body[R].range[1], c.range[1], P));
          }), P.push(We("}")), P;
        },
        BreakStatement: function(c, g) {
          return c.label ? "break " + c.label.name + this.semicolon(g) : "break" + this.semicolon(g);
        },
        ContinueStatement: function(c, g) {
          return c.label ? "continue " + c.label.name + this.semicolon(g) : "continue" + this.semicolon(g);
        },
        ClassBody: function(c, g) {
          var d = ["{", M], y = this;
          return ke(function(P) {
            var N, R;
            for (N = 0, R = c.body.length; N < R; ++N)
              d.push(P), d.push(y.generateExpression(c.body[N], n.Sequence, $)), N + 1 < R && d.push(M);
          }), _e(ye(d).toString()) || d.push(M), d.push(a), d.push("}"), d;
        },
        ClassDeclaration: function(c, g) {
          var d, y;
          return d = ["class"], c.id && (d = ue(d, this.generateExpression(c.id, n.Sequence, $))), c.superClass && (y = ue("extends", this.generateExpression(c.superClass, n.Unary, $)), d = ue(d, y)), d.push(v), d.push(this.generateStatement(c.body, qe)), d;
        },
        DirectiveStatement: function(c, g) {
          return S.raw && c.raw ? c.raw + this.semicolon(g) : Jt(c.directive) + this.semicolon(g);
        },
        DoWhileStatement: function(c, g) {
          var d = ue("do", this.maybeBlock(c.body, Ae));
          return d = this.maybeBlockSuffix(c.body, d), ue(d, [
            "while" + v + "(",
            this.generateExpression(c.test, n.Sequence, $),
            ")" + this.semicolon(g)
          ]);
        },
        CatchClause: function(c, g) {
          var d, y = this;
          return ke(function() {
            var P;
            c.param ? (d = [
              "catch" + v + "(",
              y.generateExpression(c.param, n.Sequence, $),
              ")"
            ], c.guard && (P = y.generateExpression(c.guard, n.Sequence, $), d.splice(2, 0, " if ", P))) : d = ["catch"];
          }), d.push(this.maybeBlock(c.body, Ae)), d;
        },
        DebuggerStatement: function(c, g) {
          return "debugger" + this.semicolon(g);
        },
        EmptyStatement: function(c, g) {
          return ";";
        },
        ExportDefaultDeclaration: function(c, g) {
          var d = ["export"], y;
          return y = g & ie ? qe : Ae, d = ue(d, "default"), O(c.declaration) ? d = ue(d, this.generateStatement(c.declaration, y)) : d = ue(d, this.generateExpression(c.declaration, n.Assignment, $) + this.semicolon(g)), d;
        },
        ExportNamedDeclaration: function(c, g) {
          var d = ["export"], y, P = this;
          return y = g & ie ? qe : Ae, c.declaration ? ue(d, this.generateStatement(c.declaration, y)) : (c.specifiers && (c.specifiers.length === 0 ? d = ue(d, "{" + v + "}") : c.specifiers[0].type === t.ExportBatchSpecifier ? d = ue(d, this.generateExpression(c.specifiers[0], n.Sequence, $)) : (d = ue(d, "{"), ke(function(N) {
            var R, Z;
            for (d.push(M), R = 0, Z = c.specifiers.length; R < Z; ++R)
              d.push(N), d.push(P.generateExpression(c.specifiers[R], n.Sequence, $)), R + 1 < Z && d.push("," + M);
          }), _e(ye(d).toString()) || d.push(M), d.push(a + "}")), c.source ? d = ue(d, [
            "from" + v,
            // ModuleSpecifier
            this.generateExpression(c.source, n.Sequence, $),
            this.semicolon(g)
          ]) : d.push(this.semicolon(g))), d);
        },
        ExportAllDeclaration: function(c, g) {
          return [
            "export" + v,
            "*" + v,
            "from" + v,
            // ModuleSpecifier
            this.generateExpression(c.source, n.Sequence, $),
            this.semicolon(g)
          ];
        },
        ExpressionStatement: function(c, g) {
          var d, y;
          function P(Z) {
            var J;
            return Z.slice(0, 5) !== "class" ? !1 : (J = Z.charCodeAt(5), J === 123 || u.code.isWhiteSpace(J) || u.code.isLineTerminator(J));
          }
          function N(Z) {
            var J;
            return Z.slice(0, 8) !== "function" ? !1 : (J = Z.charCodeAt(8), J === 40 || u.code.isWhiteSpace(J) || J === 42 || u.code.isLineTerminator(J));
          }
          function R(Z) {
            var J, Ce, Oe;
            if (Z.slice(0, 5) !== "async" || !u.code.isWhiteSpace(Z.charCodeAt(5)))
              return !1;
            for (Ce = 6, Oe = Z.length; Ce < Oe && u.code.isWhiteSpace(Z.charCodeAt(Ce)); ++Ce)
              ;
            return Ce === Oe || Z.slice(Ce, Ce + 8) !== "function" ? !1 : (J = Z.charCodeAt(Ce + 8), J === 40 || u.code.isWhiteSpace(J) || J === 42 || u.code.isLineTerminator(J));
          }
          return d = [this.generateExpression(c.expression, n.Sequence, $)], y = ye(d).toString(), y.charCodeAt(0) === 123 || // ObjectExpression
          P(y) || N(y) || R(y) || G && g & le && c.expression.type === t.Literal && typeof c.expression.value == "string" ? d = ["(", d, ")" + this.semicolon(g)] : d.push(this.semicolon(g)), d;
        },
        ImportDeclaration: function(c, g) {
          var d, y, P = this;
          return c.specifiers.length === 0 ? [
            "import",
            v,
            // ModuleSpecifier
            this.generateExpression(c.source, n.Sequence, $),
            this.semicolon(g)
          ] : (d = [
            "import"
          ], y = 0, c.specifiers[y].type === t.ImportDefaultSpecifier && (d = ue(d, [
            this.generateExpression(c.specifiers[y], n.Sequence, $)
          ]), ++y), c.specifiers[y] && (y !== 0 && d.push(","), c.specifiers[y].type === t.ImportNamespaceSpecifier ? d = ue(d, [
            v,
            this.generateExpression(c.specifiers[y], n.Sequence, $)
          ]) : (d.push(v + "{"), c.specifiers.length - y === 1 ? (d.push(v), d.push(this.generateExpression(c.specifiers[y], n.Sequence, $)), d.push(v + "}" + v)) : (ke(function(N) {
            var R, Z;
            for (d.push(M), R = y, Z = c.specifiers.length; R < Z; ++R)
              d.push(N), d.push(P.generateExpression(c.specifiers[R], n.Sequence, $)), R + 1 < Z && d.push("," + M);
          }), _e(ye(d).toString()) || d.push(M), d.push(a + "}" + v)))), d = ue(d, [
            "from" + v,
            // ModuleSpecifier
            this.generateExpression(c.source, n.Sequence, $),
            this.semicolon(g)
          ]), d);
        },
        VariableDeclarator: function(c, g) {
          var d = g & W ? $ : oe;
          return c.init ? [
            this.generateExpression(c.id, n.Assignment, d),
            v,
            "=",
            v,
            this.generateExpression(c.init, n.Assignment, d)
          ] : this.generatePattern(c.id, n.Assignment, d);
        },
        VariableDeclaration: function(c, g) {
          var d, y, P, N, R, Z = this;
          d = [c.kind], R = g & W ? Ae : xe;
          function J() {
            for (N = c.declarations[0], S.comment && N.leadingComments ? (d.push(`
`), d.push(We(Z.generateStatement(N, R)))) : (d.push(Ze()), d.push(Z.generateStatement(N, R))), y = 1, P = c.declarations.length; y < P; ++y)
              N = c.declarations[y], S.comment && N.leadingComments ? (d.push("," + M), d.push(We(Z.generateStatement(N, R)))) : (d.push("," + v), d.push(Z.generateStatement(N, R)));
          }
          return c.declarations.length > 1 ? ke(J) : J(), d.push(this.semicolon(g)), d;
        },
        ThrowStatement: function(c, g) {
          return [ue(
            "throw",
            this.generateExpression(c.argument, n.Sequence, $)
          ), this.semicolon(g)];
        },
        TryStatement: function(c, g) {
          var d, y, P, N;
          if (d = ["try", this.maybeBlock(c.block, Ae)], d = this.maybeBlockSuffix(c.block, d), c.handlers)
            for (y = 0, P = c.handlers.length; y < P; ++y)
              d = ue(d, this.generateStatement(c.handlers[y], Ae)), (c.finalizer || y + 1 !== P) && (d = this.maybeBlockSuffix(c.handlers[y].body, d));
          else {
            for (N = c.guardedHandlers || [], y = 0, P = N.length; y < P; ++y)
              d = ue(d, this.generateStatement(N[y], Ae)), (c.finalizer || y + 1 !== P) && (d = this.maybeBlockSuffix(N[y].body, d));
            if (c.handler)
              if (Array.isArray(c.handler))
                for (y = 0, P = c.handler.length; y < P; ++y)
                  d = ue(d, this.generateStatement(c.handler[y], Ae)), (c.finalizer || y + 1 !== P) && (d = this.maybeBlockSuffix(c.handler[y].body, d));
              else
                d = ue(d, this.generateStatement(c.handler, Ae)), c.finalizer && (d = this.maybeBlockSuffix(c.handler.body, d));
          }
          return c.finalizer && (d = ue(d, ["finally", this.maybeBlock(c.finalizer, Ae)])), d;
        },
        SwitchStatement: function(c, g) {
          var d, y, P, N, R, Z = this;
          if (ke(function() {
            d = [
              "switch" + v + "(",
              Z.generateExpression(c.discriminant, n.Sequence, $),
              ")" + v + "{" + M
            ];
          }), c.cases)
            for (R = Ae, P = 0, N = c.cases.length; P < N; ++P)
              P === N - 1 && (R |= ie), y = We(this.generateStatement(c.cases[P], R)), d.push(y), _e(ye(y).toString()) || d.push(M);
          return d.push(We("}")), d;
        },
        SwitchCase: function(c, g) {
          var d, y, P, N, R, Z = this;
          return ke(function() {
            for (c.test ? d = [
              ue("case", Z.generateExpression(c.test, n.Sequence, $)),
              ":"
            ] : d = ["default:"], P = 0, N = c.consequent.length, N && c.consequent[0].type === t.BlockStatement && (y = Z.maybeBlock(c.consequent[0], Ae), d.push(y), P = 1), P !== N && !_e(ye(d).toString()) && d.push(M), R = Ae; P < N; ++P)
              P === N - 1 && g & ie && (R |= ie), y = We(Z.generateStatement(c.consequent[P], R)), d.push(y), P + 1 !== N && !_e(ye(y).toString()) && d.push(M);
          }), d;
        },
        IfStatement: function(c, g) {
          var d, y, P, N = this;
          return ke(function() {
            d = [
              "if" + v + "(",
              N.generateExpression(c.test, n.Sequence, $),
              ")"
            ];
          }), P = g & ie, y = Ae, P && (y |= ie), c.alternate ? (d.push(this.maybeBlock(c.consequent, Ae)), d = this.maybeBlockSuffix(c.consequent, d), c.alternate.type === t.IfStatement ? d = ue(d, ["else ", this.generateStatement(c.alternate, y)]) : d = ue(d, ue("else", this.maybeBlock(c.alternate, y)))) : d.push(this.maybeBlock(c.consequent, y)), d;
        },
        ForStatement: function(c, g) {
          var d, y = this;
          return ke(function() {
            d = ["for" + v + "("], c.init ? c.init.type === t.VariableDeclaration ? d.push(y.generateStatement(c.init, xe)) : (d.push(y.generateExpression(c.init, n.Sequence, oe)), d.push(";")) : d.push(";"), c.test && (d.push(v), d.push(y.generateExpression(c.test, n.Sequence, $))), d.push(";"), c.update && (d.push(v), d.push(y.generateExpression(c.update, n.Sequence, $))), d.push(")");
          }), d.push(this.maybeBlock(c.body, g & ie ? qe : Ae)), d;
        },
        ForInStatement: function(c, g) {
          return this.generateIterationForStatement("in", c, g & ie ? qe : Ae);
        },
        ForOfStatement: function(c, g) {
          return this.generateIterationForStatement("of", c, g & ie ? qe : Ae);
        },
        LabeledStatement: function(c, g) {
          return [c.label.name + ":", this.maybeBlock(c.body, g & ie ? qe : Ae)];
        },
        Program: function(c, g) {
          var d, y, P, N, R;
          for (N = c.body.length, d = [_ && N > 0 ? `
` : ""], R = je, P = 0; P < N; ++P)
            !_ && P === N - 1 && (R |= ie), V && (P === 0 && (c.body[0].leadingComments || bt(c.range[0], c.body[P].range[0], d)), P > 0 && !c.body[P - 1].trailingComments && !c.body[P].leadingComments && bt(c.body[P - 1].range[1], c.body[P].range[0], d)), y = We(this.generateStatement(c.body[P], R)), d.push(y), P + 1 < N && !_e(ye(y).toString()) && (V && c.body[P + 1].leadingComments || d.push(M)), V && P === N - 1 && (c.body[P].trailingComments || bt(c.body[P].range[1], c.range[1], d));
          return d;
        },
        FunctionDeclaration: function(c, g) {
          return [
            Yt(c, !0),
            "function",
            Me(c) || Ze(),
            c.id ? Qe(c.id) : "",
            this.generateFunctionBody(c)
          ];
        },
        ReturnStatement: function(c, g) {
          return c.argument ? [ue(
            "return",
            this.generateExpression(c.argument, n.Sequence, $)
          ), this.semicolon(g)] : ["return" + this.semicolon(g)];
        },
        WhileStatement: function(c, g) {
          var d, y = this;
          return ke(function() {
            d = [
              "while" + v + "(",
              y.generateExpression(c.test, n.Sequence, $),
              ")"
            ];
          }), d.push(this.maybeBlock(c.body, g & ie ? qe : Ae)), d;
        },
        WithStatement: function(c, g) {
          var d, y = this;
          return ke(function() {
            d = [
              "with" + v + "(",
              y.generateExpression(c.object, n.Sequence, $),
              ")"
            ];
          }), d.push(this.maybeBlock(c.body, g & ie ? qe : Ae)), d;
        }
      }, Kt(Ne.prototype, Ne.Statement), Ne.Expression = {
        SequenceExpression: function(c, g, d) {
          var y, P, N;
          for (n.Sequence < g && (d |= W), y = [], P = 0, N = c.expressions.length; P < N; ++P)
            y.push(this.generateExpression(c.expressions[P], n.Assignment, d)), P + 1 < N && y.push("," + v);
          return fe(y, n.Sequence, g);
        },
        AssignmentExpression: function(c, g, d) {
          return this.generateAssignment(c.left, c.right, c.operator, g, d);
        },
        ArrowFunctionExpression: function(c, g, d) {
          return fe(this.generateFunctionBody(c), n.ArrowFunction, g);
        },
        ConditionalExpression: function(c, g, d) {
          return n.Conditional < g && (d |= W), fe(
            [
              this.generateExpression(c.test, n.Coalesce, d),
              v + "?" + v,
              this.generateExpression(c.consequent, n.Assignment, d),
              v + ":" + v,
              this.generateExpression(c.alternate, n.Assignment, d)
            ],
            n.Conditional,
            g
          );
        },
        LogicalExpression: function(c, g, d) {
          return c.operator === "??" && (d |= Ie), this.BinaryExpression(c, g, d);
        },
        BinaryExpression: function(c, g, d) {
          var y, P, N, R, Z, J;
          return R = r[c.operator], P = c.operator === "**" ? n.Postfix : R, N = c.operator === "**" ? R : R + 1, R < g && (d |= W), Z = this.generateExpression(c.left, P, d), J = Z.toString(), J.charCodeAt(J.length - 1) === 47 && u.code.isIdentifierPartES5(c.operator.charCodeAt(0)) ? y = [Z, Ze(), c.operator] : y = ue(Z, c.operator), Z = this.generateExpression(c.right, N, d), c.operator === "/" && Z.toString().charAt(0) === "/" || c.operator.slice(-1) === "<" && Z.toString().slice(0, 3) === "!--" ? (y.push(Ze()), y.push(Z)) : y = ue(y, Z), c.operator === "in" && !(d & W) ? ["(", y, ")"] : (c.operator === "||" || c.operator === "&&") && d & Ie ? ["(", y, ")"] : fe(y, R, g);
        },
        CallExpression: function(c, g, d) {
          var y, P, N;
          for (y = [this.generateExpression(c.callee, n.Call, ge)], c.optional && y.push("?."), y.push("("), P = 0, N = c.arguments.length; P < N; ++P)
            y.push(this.generateExpression(c.arguments[P], n.Assignment, $)), P + 1 < N && y.push("," + v);
          return y.push(")"), d & ee ? fe(y, n.Call, g) : ["(", y, ")"];
        },
        ChainExpression: function(c, g, d) {
          n.OptionalChaining < g && (d |= ee);
          var y = this.generateExpression(c.expression, n.OptionalChaining, d);
          return fe(y, n.OptionalChaining, g);
        },
        NewExpression: function(c, g, d) {
          var y, P, N, R, Z;
          if (P = c.arguments.length, Z = d & be && !E && P === 0 ? ze : Pe, y = ue(
            "new",
            this.generateExpression(c.callee, n.New, Z)
          ), !(d & be) || E || P > 0) {
            for (y.push("("), N = 0, R = P; N < R; ++N)
              y.push(this.generateExpression(c.arguments[N], n.Assignment, $)), N + 1 < R && y.push("," + v);
            y.push(")");
          }
          return fe(y, n.New, g);
        },
        MemberExpression: function(c, g, d) {
          var y, P;
          return y = [this.generateExpression(c.object, n.Call, d & ee ? ge : Pe)], c.computed ? (c.optional && y.push("?."), y.push("["), y.push(this.generateExpression(c.property, n.Sequence, d & ee ? $ : ze)), y.push("]")) : (!c.optional && c.object.type === t.Literal && typeof c.object.value == "number" && (P = ye(y).toString(), P.indexOf(".") < 0 && !/[eExX]/.test(P) && u.code.isDecimalDigit(P.charCodeAt(P.length - 1)) && !(P.length >= 2 && P.charCodeAt(0) === 48) && y.push(" ")), y.push(c.optional ? "?." : "."), y.push(Qe(c.property))), fe(y, n.Member, g);
        },
        MetaProperty: function(c, g, d) {
          var y;
          return y = [], y.push(typeof c.meta == "string" ? c.meta : Qe(c.meta)), y.push("."), y.push(typeof c.property == "string" ? c.property : Qe(c.property)), fe(y, n.Member, g);
        },
        UnaryExpression: function(c, g, d) {
          var y, P, N, R, Z;
          return P = this.generateExpression(c.argument, n.Unary, $), v === "" ? y = ue(c.operator, P) : (y = [c.operator], c.operator.length > 2 ? y = ue(y, P) : (R = ye(y).toString(), Z = R.charCodeAt(R.length - 1), N = P.toString().charCodeAt(0), ((Z === 43 || Z === 45) && Z === N || u.code.isIdentifierPartES5(Z) && u.code.isIdentifierPartES5(N)) && y.push(Ze()), y.push(P))), fe(y, n.Unary, g);
        },
        YieldExpression: function(c, g, d) {
          var y;
          return c.delegate ? y = "yield*" : y = "yield", c.argument && (y = ue(
            y,
            this.generateExpression(c.argument, n.Yield, $)
          )), fe(y, n.Yield, g);
        },
        AwaitExpression: function(c, g, d) {
          var y = ue(
            c.all ? "await*" : "await",
            this.generateExpression(c.argument, n.Await, $)
          );
          return fe(y, n.Await, g);
        },
        UpdateExpression: function(c, g, d) {
          return c.prefix ? fe(
            [
              c.operator,
              this.generateExpression(c.argument, n.Unary, $)
            ],
            n.Unary,
            g
          ) : fe(
            [
              this.generateExpression(c.argument, n.Postfix, $),
              c.operator
            ],
            n.Postfix,
            g
          );
        },
        FunctionExpression: function(c, g, d) {
          var y = [
            Yt(c, !0),
            "function"
          ];
          return c.id ? (y.push(Me(c) || Ze()), y.push(Qe(c.id))) : y.push(Me(c) || v), y.push(this.generateFunctionBody(c)), y;
        },
        ArrayPattern: function(c, g, d) {
          return this.ArrayExpression(c, g, d, !0);
        },
        ArrayExpression: function(c, g, d, y) {
          var P, N, R = this;
          return c.elements.length ? (N = y ? !1 : c.elements.length > 1, P = ["[", N ? M : ""], ke(function(Z) {
            var J, Ce;
            for (J = 0, Ce = c.elements.length; J < Ce; ++J)
              c.elements[J] ? (P.push(N ? Z : ""), P.push(R.generateExpression(c.elements[J], n.Assignment, $))) : (N && P.push(Z), J + 1 === Ce && P.push(",")), J + 1 < Ce && P.push("," + (N ? M : v));
          }), N && !_e(ye(P).toString()) && P.push(M), P.push(N ? a : ""), P.push("]"), P) : "[]";
        },
        RestElement: function(c, g, d) {
          return "..." + this.generatePattern(c.argument);
        },
        ClassExpression: function(c, g, d) {
          var y, P;
          return y = ["class"], c.id && (y = ue(y, this.generateExpression(c.id, n.Sequence, $))), c.superClass && (P = ue("extends", this.generateExpression(c.superClass, n.Unary, $)), y = ue(y, P)), y.push(v), y.push(this.generateStatement(c.body, qe)), y;
        },
        MethodDefinition: function(c, g, d) {
          var y, P;
          return c.static ? y = ["static" + v] : y = [], c.kind === "get" || c.kind === "set" ? P = [
            ue(c.kind, this.generatePropertyKey(c.key, c.computed)),
            this.generateFunctionBody(c.value)
          ] : P = [
            vt(c),
            this.generatePropertyKey(c.key, c.computed),
            this.generateFunctionBody(c.value)
          ], ue(y, P);
        },
        Property: function(c, g, d) {
          return c.kind === "get" || c.kind === "set" ? [
            c.kind,
            Ze(),
            this.generatePropertyKey(c.key, c.computed),
            this.generateFunctionBody(c.value)
          ] : c.shorthand ? c.value.type === "AssignmentPattern" ? this.AssignmentPattern(c.value, n.Sequence, $) : this.generatePropertyKey(c.key, c.computed) : c.method ? [
            vt(c),
            this.generatePropertyKey(c.key, c.computed),
            this.generateFunctionBody(c.value)
          ] : [
            this.generatePropertyKey(c.key, c.computed),
            ":" + v,
            this.generateExpression(c.value, n.Assignment, $)
          ];
        },
        ObjectExpression: function(c, g, d) {
          var y, P, N, R = this;
          return c.properties.length ? (y = c.properties.length > 1, ke(function() {
            N = R.generateExpression(c.properties[0], n.Sequence, $);
          }), !y && !cn(ye(N).toString()) ? ["{", v, N, v, "}"] : (ke(function(Z) {
            var J, Ce;
            if (P = ["{", M, Z, N], y)
              for (P.push("," + M), J = 1, Ce = c.properties.length; J < Ce; ++J)
                P.push(Z), P.push(R.generateExpression(c.properties[J], n.Sequence, $)), J + 1 < Ce && P.push("," + M);
          }), _e(ye(P).toString()) || P.push(M), P.push(a), P.push("}"), P)) : "{}";
        },
        AssignmentPattern: function(c, g, d) {
          return this.generateAssignment(c.left, c.right, "=", g, d);
        },
        ObjectPattern: function(c, g, d) {
          var y, P, N, R, Z, J = this;
          if (!c.properties.length)
            return "{}";
          if (R = !1, c.properties.length === 1)
            Z = c.properties[0], Z.type === t.Property && Z.value.type !== t.Identifier && (R = !0);
          else
            for (P = 0, N = c.properties.length; P < N; ++P)
              if (Z = c.properties[P], Z.type === t.Property && !Z.shorthand) {
                R = !0;
                break;
              }
          return y = ["{", R ? M : ""], ke(function(Ce) {
            var Oe, dn;
            for (Oe = 0, dn = c.properties.length; Oe < dn; ++Oe)
              y.push(R ? Ce : ""), y.push(J.generateExpression(c.properties[Oe], n.Sequence, $)), Oe + 1 < dn && y.push("," + (R ? M : v));
          }), R && !_e(ye(y).toString()) && y.push(M), y.push(R ? a : ""), y.push("}"), y;
        },
        ThisExpression: function(c, g, d) {
          return "this";
        },
        Super: function(c, g, d) {
          return "super";
        },
        Identifier: function(c, g, d) {
          return Qe(c);
        },
        ImportDefaultSpecifier: function(c, g, d) {
          return Qe(c.id || c.local);
        },
        ImportNamespaceSpecifier: function(c, g, d) {
          var y = ["*"], P = c.id || c.local;
          return P && y.push(v + "as" + Ze() + Qe(P)), y;
        },
        ImportSpecifier: function(c, g, d) {
          var y = c.imported, P = [y.name], N = c.local;
          return N && N.name !== y.name && P.push(Ze() + "as" + Ze() + Qe(N)), P;
        },
        ExportSpecifier: function(c, g, d) {
          var y = c.local, P = [y.name], N = c.exported;
          return N && N.name !== y.name && P.push(Ze() + "as" + Ze() + Qe(N)), P;
        },
        Literal: function(c, g, d) {
          var y;
          if (c.hasOwnProperty("raw") && x && S.raw)
            try {
              if (y = x(c.raw).body[0].expression, y.type === t.Literal && y.value === c.value)
                return c.raw;
            } catch {
            }
          return c.regex ? "/" + c.regex.pattern + "/" + c.regex.flags : typeof c.value == "bigint" ? c.value.toString() + "n" : c.bigint ? c.bigint + "n" : c.value === null ? "null" : typeof c.value == "string" ? yt(c.value) : typeof c.value == "number" ? Nt(c.value) : typeof c.value == "boolean" ? c.value ? "true" : "false" : Wn(c.value);
        },
        GeneratorExpression: function(c, g, d) {
          return this.ComprehensionExpression(c, g, d);
        },
        ComprehensionExpression: function(c, g, d) {
          var y, P, N, R, Z = this;
          return y = c.type === t.GeneratorExpression ? ["("] : ["["], S.moz.comprehensionExpressionStartsWithAssignment && (R = this.generateExpression(c.body, n.Assignment, $), y.push(R)), c.blocks && ke(function() {
            for (P = 0, N = c.blocks.length; P < N; ++P)
              R = Z.generateExpression(c.blocks[P], n.Sequence, $), P > 0 || S.moz.comprehensionExpressionStartsWithAssignment ? y = ue(y, R) : y.push(R);
          }), c.filter && (y = ue(y, "if" + v), R = this.generateExpression(c.filter, n.Sequence, $), y = ue(y, ["(", R, ")"])), S.moz.comprehensionExpressionStartsWithAssignment || (R = this.generateExpression(c.body, n.Assignment, $), y = ue(y, R)), y.push(c.type === t.GeneratorExpression ? ")" : "]"), y;
        },
        ComprehensionBlock: function(c, g, d) {
          var y;
          return c.left.type === t.VariableDeclaration ? y = [
            c.left.kind,
            Ze(),
            this.generateStatement(c.left.declarations[0], xe)
          ] : y = this.generateExpression(c.left, n.Call, $), y = ue(y, c.of ? "of" : "in"), y = ue(y, this.generateExpression(c.right, n.Sequence, $)), ["for" + v + "(", y, ")"];
        },
        SpreadElement: function(c, g, d) {
          return [
            "...",
            this.generateExpression(c.argument, n.Assignment, $)
          ];
        },
        TaggedTemplateExpression: function(c, g, d) {
          var y = ge;
          d & ee || (y = Pe);
          var P = [
            this.generateExpression(c.tag, n.Call, y),
            this.generateExpression(c.quasi, n.Primary, it)
          ];
          return fe(P, n.TaggedTemplate, g);
        },
        TemplateElement: function(c, g, d) {
          return c.value.raw;
        },
        TemplateLiteral: function(c, g, d) {
          var y, P, N;
          for (y = ["`"], P = 0, N = c.quasis.length; P < N; ++P)
            y.push(this.generateExpression(c.quasis[P], n.Primary, $)), P + 1 < N && (y.push("${" + v), y.push(this.generateExpression(c.expressions[P], n.Sequence, $)), y.push(v + "}"));
          return y.push("`"), y;
        },
        ModuleSpecifier: function(c, g, d) {
          return this.Literal(c, g, d);
        },
        ImportExpression: function(c, g, d) {
          return fe([
            "import(",
            this.generateExpression(c.source, n.Assignment, $),
            ")"
          ], n.Call, g);
        }
      }, Kt(Ne.prototype, Ne.Expression), Ne.prototype.generateExpression = function(c, g, d) {
        var y, P;
        return P = c.type || t.Property, S.verbatim && c.hasOwnProperty(S.verbatim) ? pn(c, g) : (y = this[P](c, g, d), S.comment && (y = Tt(c, y)), ye(y, c));
      }, Ne.prototype.generateStatement = function(c, g) {
        var d, y;
        return d = this[c.type](c, g), S.comment && (d = Tt(c, d)), y = ye(d).toString(), c.type === t.Program && !_ && M === "" && y.charAt(y.length - 1) === `
` && (d = B ? ye(d).replaceRight(/\s+$/, "") : y.replace(/\s+$/, "")), ye(d, c);
      };
      function lt(c) {
        var g;
        if (g = new Ne(), O(c))
          return g.generateStatement(c, Ae);
        if (U(c))
          return g.generateExpression(c, n.Sequence, $);
        throw new Error("Unknown node type: " + c.type);
      }
      function ft(c, g) {
        var d = ut(), y, P;
        return g != null ? (typeof g.indent == "string" && (d.format.indent.style = g.indent), typeof g.base == "number" && (d.format.indent.base = g.base), g = Vt(d, g), o = g.format.indent.style, typeof g.base == "string" ? a = g.base : a = Ve(o, g.format.indent.base)) : (g = d, o = g.format.indent.style, a = Ve(o, g.format.indent.base)), f = g.format.json, h = g.format.renumber, m = f ? !1 : g.format.hexadecimal, p = f ? "double" : g.format.quotes, A = g.format.escapeless, M = g.format.newline, v = g.format.space, g.format.compact && (M = v = o = a = ""), E = g.format.parentheses, k = g.format.semicolons, _ = g.format.safeConcatenation, G = g.directive, x = f ? null : g.parse, B = g.sourceMap, I = g.sourceCode, V = g.format.preserveBlankLines && I !== null, S = g, B && (e.browser ? i = jv.sourceMap.SourceNode : i = rP().SourceNode), y = lt(c), B ? (P = y.toStringWithSourceMap({
          file: g.file,
          sourceRoot: g.sourceMapRoot
        }), g.sourceContent && P.map.setSourceContent(
          g.sourceMap,
          g.sourceContent
        ), g.sourceMapWithCode ? P : P.map.toString()) : (P = { code: y.toString(), map: null }, g.sourceMapWithCode ? P : P.code);
      }
      q = {
        indent: {
          style: "",
          base: 0
        },
        renumber: !0,
        hexadecimal: !0,
        quotes: "auto",
        escapeless: !0,
        compact: !0,
        parentheses: !1,
        semicolons: !1
      }, X = ut().format, e.version = AP.version, e.generate = ft, e.attachComments = s.attachComments, e.Precedence = Vt({}, n), e.browser = !1, e.FORMAT_MINIFY = q, e.FORMAT_DEFAULTS = X;
    })();
  }(Is)), Is;
}
var CP = MP();
const vP = /* @__PURE__ */ vm(CP);
class PP {
  constructor() {
    this.should_skip = !1, this.should_remove = !1, this.replacement = null, this.context = {
      skip: () => this.should_skip = !0,
      remove: () => this.should_remove = !0,
      replace: (t) => this.replacement = t
    };
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   * @param {Node} node
   */
  replace(t, n, r, i) {
    t && n && (r != null ? t[n][r] = i : t[n] = i);
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   */
  remove(t, n, r) {
    t && n && (r != null ? t[n].splice(r, 1) : delete t[n]);
  }
}
class DP extends PP {
  /**
   *
   * @param {SyncHandler} [enter]
   * @param {SyncHandler} [leave]
   */
  constructor(t, n) {
    super(), this.should_skip = !1, this.should_remove = !1, this.replacement = null, this.context = {
      skip: () => this.should_skip = !0,
      remove: () => this.should_remove = !0,
      replace: (r) => this.replacement = r
    }, this.enter = t, this.leave = n;
  }
  /**
   * @template {Node} Parent
   * @param {Node} node
   * @param {Parent | null} parent
   * @param {keyof Parent} [prop]
   * @param {number | null} [index]
   * @returns {Node | null}
   */
  visit(t, n, r, i) {
    if (t) {
      if (this.enter) {
        const u = this.should_skip, a = this.should_remove, o = this.replacement;
        this.should_skip = !1, this.should_remove = !1, this.replacement = null, this.enter.call(this.context, t, n, r, i), this.replacement && (t = this.replacement, this.replace(n, r, i, t)), this.should_remove && this.remove(n, r, i);
        const f = this.should_skip, h = this.should_remove;
        if (this.should_skip = u, this.should_remove = a, this.replacement = o, f) return t;
        if (h) return null;
      }
      let s;
      for (s in t) {
        const u = t[s];
        if (u && typeof u == "object")
          if (Array.isArray(u)) {
            const a = (
              /** @type {Array<unknown>} */
              u
            );
            for (let o = 0; o < a.length; o += 1) {
              const f = a[o];
              Lo(f) && (this.visit(f, t, s, o) || o--);
            }
          } else Lo(u) && this.visit(u, t, s, null);
      }
      if (this.leave) {
        const u = this.replacement, a = this.should_remove;
        this.replacement = null, this.should_remove = !1, this.leave.call(this.context, t, n, r, i), this.replacement && (t = this.replacement, this.replace(n, r, i, t)), this.should_remove && this.remove(n, r, i);
        const o = this.should_remove;
        if (this.replacement = u, this.should_remove = a, o) return null;
      }
    }
    return t;
  }
}
function Lo(e) {
  return e !== null && typeof e == "object" && "type" in e && typeof e.type == "string";
}
function FP(e, { enter: t, leave: n }) {
  return new DP(t, n).visit(e, null);
}
let xm = [];
function IF(e) {
  xm.push(e);
}
function EP(e, t = {}) {
  const { wrapAsync: n = !1, addReturn: r = !0, emitMiniLocations: i = !0, emitWidgets: s = !0 } = t;
  let u = zv(e, {
    ecmaVersion: 2022,
    allowAwaitOutsideFunction: !0,
    locations: !0
  }), a = [];
  const o = (p, A) => {
    const M = na(`"${p}"`, A.start, e);
    a = a.concat(M);
  };
  let f = [];
  FP(u, {
    enter(p, A) {
      if (RP(p)) {
        const M = p.quasi.quasis[0].value.raw, v = p.quasi.start + 1;
        if (i) {
          const E = GP(M, v);
          a = a.concat(E);
        }
        return this.skip(), this.replace(XP(M, v));
      }
      if (wP(p, A)) {
        const { quasis: M } = p, { raw: v } = M[0].value;
        return this.skip(), i && o(v, p), this.replace(Ro(v, p));
      }
      if (xP(p)) {
        const { value: M } = p;
        return this.skip(), i && o(M, p), this.replace(Ro(M, p));
      }
      if (SP(p))
        return s && f.push({
          from: p.arguments[0].start,
          to: p.arguments[0].end,
          value: p.arguments[0].raw,
          // don't use value!
          min: p.arguments[1]?.value ?? 0,
          max: p.arguments[2]?.value ?? 1,
          step: p.arguments[3]?.value,
          type: "slider"
        }), this.replace(_P(p));
      if (BP(p)) {
        const M = p.callee.property.name, v = f.filter((k) => k.type === M).length, E = {
          to: p.end,
          index: v,
          type: M,
          id: t.id
        };
        return s && f.push(E), this.replace(IP(p, E));
      }
      if (VP(p, A))
        return this.replace(NP(p));
      if (TP(p))
        return this.replace(LP(p));
    },
    leave(p, A, M, v) {
    }
  });
  const { body: h } = u;
  if (!h?.[h.length - 1]?.expression)
    throw new Error("unexpected ast format without body expression");
  if (r) {
    const { expression: p } = h[h.length - 1];
    h[h.length - 1] = {
      type: "ReturnStatement",
      argument: p
    };
  }
  let m = vP.generate(u);
  return n && (m = `(async ()=>{${m}})()`), i ? { output: m, miniLocations: a, widgets: f } : { output: m };
}
function xP(e, t, n) {
  return e.type !== "Literal" ? !1 : e.raw[0] === '"';
}
function wP(e, t) {
  return e.type === "TemplateLiteral" && t.type !== "TaggedTemplateExpression";
}
function Ro(e, t) {
  const { start: n } = t;
  return {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: "m"
    },
    arguments: [
      { type: "Literal", value: e },
      { type: "Literal", value: n }
    ],
    optional: !1
  };
}
function SP(e) {
  return e.type === "CallExpression" && e.callee.name === "slider";
}
function BP(e) {
  return e.type === "CallExpression" && xm.includes(e.callee.property?.name);
}
function _P(e) {
  const t = "slider_" + e.arguments[0].start;
  return e.arguments.unshift({
    type: "Literal",
    value: t,
    raw: t
  }), e.callee.name = "sliderWithID", e;
}
function kP(e) {
  return `${e.id || ""}_widget_${e.type}_${e.index}`;
}
function IP(e, t) {
  const n = kP(t);
  return e.arguments.unshift({
    type: "Literal",
    value: n,
    raw: n
  }), e;
}
function VP(e, t) {
  return e.type === "CallExpression" && e.callee.name === "samples" && t.type !== "AwaitExpression";
}
function NP(e) {
  return {
    type: "AwaitExpression",
    argument: e
  };
}
function TP(e) {
  return e.type === "LabeledStatement";
}
function LP(e) {
  return {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: e.body.expression,
        property: {
          type: "Identifier",
          name: "p"
        }
      },
      arguments: [
        {
          type: "Literal",
          value: e.label.name,
          raw: `'${e.label.name}'`
        }
      ]
    }
  };
}
function RP(e) {
  return e.type === "TaggedTemplateExpression" && e.tag.name === "tidal";
}
function GP(e, t) {
  return e.split("").reduce((n, r, i) => (r !== '"' || (!n.length || n[n.length - 1].length > 1 ? n.push([i + 1]) : n[n.length - 1].push(i)), n), []).map(([n, r]) => {
    const i = e.slice(n, r);
    return na(`"${i}"`, t + n - 1);
  }).flat();
}
function XP(e, t) {
  return {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: "tidal"
    },
    arguments: [
      { type: "Literal", value: e },
      { type: "Literal", value: t }
    ],
    optional: !1
  };
}
function ha(e) {
  return e !== null && typeof e == "object" && "name" in e && typeof e.name == "string";
}
function pa(e) {
  return e !== null && typeof e == "object" && "step" in e && typeof e.step == "number" && "alt" in e && typeof e.alt == "number" && !isNaN(e.step) && !isNaN(e.alt);
}
var wm = [0, 2, 4, -1, 1, 3, 5], Sm = wm.map(
  (e) => Math.floor(e * 7 / 12)
);
function Bm(e) {
  const { step: t, alt: n, oct: r, dir: i = 1 } = e, s = wm[t] + 7 * n;
  if (r === void 0)
    return [i * s];
  const u = r - Sm[t] - 4 * n;
  return [i * s, i * u];
}
var ZP = [3, 0, 4, 1, 5, 2, 6];
function _m(e) {
  const [t, n, r] = e, i = ZP[WP(t)], s = Math.floor((t + 1) / 7);
  if (n === void 0)
    return { step: i, alt: s, dir: r };
  const u = n + 4 * s + Sm[i];
  return { step: i, alt: s, oct: u, dir: r };
}
function WP(e) {
  const t = (e + 1) % 7;
  return t < 0 ? 7 + t : t;
}
var Go = (e, t) => Array(Math.abs(t) + 1).join(e), pu = Object.freeze({
  empty: !0,
  name: "",
  num: NaN,
  q: "",
  type: "",
  step: NaN,
  alt: NaN,
  dir: NaN,
  simple: NaN,
  semitones: NaN,
  chroma: NaN,
  coord: [],
  oct: NaN
}), OP = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})", zP = "(AA|A|P|M|m|d|dd)([-+]?\\d+)", jP = new RegExp(
  "^" + OP + "|" + zP + "$"
);
function $P(e) {
  const t = jP.exec(`${e}`);
  return t === null ? ["", ""] : t[1] ? [t[1], t[2]] : [t[4], t[3]];
}
var Xo = {};
function nn(e) {
  return typeof e == "string" ? Xo[e] || (Xo[e] = qP(e)) : pa(e) ? nn(HP(e)) : ha(e) ? nn(e.name) : pu;
}
var Zo = [0, 2, 4, 5, 7, 9, 11], km = "PMMPPMM";
function qP(e) {
  const t = $P(e);
  if (t[0] === "")
    return pu;
  const n = +t[0], r = t[1], i = (Math.abs(n) - 1) % 7, s = km[i];
  if (s === "M" && r === "P")
    return pu;
  const u = s === "M" ? "majorable" : "perfectable", a = "" + n + r, o = n < 0 ? -1 : 1, f = n === 8 || n === -8 ? n : o * (i + 1), h = KP(u, r), m = Math.floor((Math.abs(n) - 1) / 7), p = o * (Zo[i] + h + 12 * m), A = (o * (Zo[i] + h) % 12 + 12) % 12, M = Bm({ step: i, alt: h, oct: m, dir: o });
  return {
    empty: !1,
    name: a,
    num: n,
    q: r,
    step: i,
    alt: h,
    dir: o,
    type: u,
    simple: f,
    semitones: p,
    chroma: A,
    coord: M,
    oct: m
  };
}
function Im(e, t) {
  const [n, r = 0] = e, i = n * 7 + r * 12 < 0, s = t || i ? [-n, -r, -1] : [n, r, 1];
  return nn(_m(s));
}
function KP(e, t) {
  return t === "M" && e === "majorable" || t === "P" && e === "perfectable" ? 0 : t === "m" && e === "majorable" ? -1 : /^A+$/.test(t) ? t.length : /^d+$/.test(t) ? -1 * (e === "perfectable" ? t.length : t.length + 1) : 0;
}
function HP(e) {
  const { step: t, alt: n, oct: r = 0, dir: i } = e;
  if (!i)
    return "";
  const s = t + 1 + 7 * r, u = s === 0 ? t + 1 : s, a = i < 0 ? "-" : "", o = km[t] === "M" ? "majorable" : "perfectable";
  return a + u + JP(o, n);
}
function JP(e, t) {
  return t === 0 ? e === "majorable" ? "M" : "P" : t === -1 && e === "majorable" ? "m" : t > 0 ? Go("A", t) : Go("d", e === "perfectable" ? t : t + 1);
}
var Wo = (e, t) => Array(Math.abs(t) + 1).join(e), Vm = Object.freeze({
  empty: !0,
  name: "",
  letter: "",
  acc: "",
  pc: "",
  step: NaN,
  alt: NaN,
  chroma: NaN,
  height: NaN,
  coord: [],
  midi: null,
  freq: null
}), Oo = /* @__PURE__ */ new Map(), YP = (e) => "CDEFGAB".charAt(e), es = (e) => e < 0 ? Wo("b", -e) : Wo("#", e), da = (e) => e[0] === "b" ? -e.length : e.length;
function Se(e) {
  const t = JSON.stringify(e), n = Oo.get(t);
  if (n)
    return n;
  const r = typeof e == "string" ? tD(e) : pa(e) ? Se(nD(e)) : ha(e) ? Se(e.name) : Vm;
  return Oo.set(t, r), r;
}
var UP = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
function ma(e) {
  const t = UP.exec(e);
  return t ? [t[1].toUpperCase(), t[2].replace(/x/g, "##"), t[3], t[4]] : ["", "", "", ""];
}
function QP(e) {
  return Se(_m(e));
}
var eD = (e, t) => (e % t + t) % t, js = [0, 2, 4, 5, 7, 9, 11];
function tD(e) {
  const t = ma(e);
  if (t[0] === "" || t[3] !== "")
    return Vm;
  const n = t[0], r = t[1], i = t[2], s = (n.charCodeAt(0) + 3) % 7, u = da(r), a = i.length ? +i : void 0, o = Bm({ step: s, alt: u, oct: a }), f = n + r + i, h = n + r, m = (js[s] + u + 120) % 12, p = a === void 0 ? eD(js[s] + u, 12) - 12 * 99 : js[s] + u + 12 * (a + 1), A = p >= 0 && p <= 127 ? p : null, M = a === void 0 ? null : Math.pow(2, (p - 69) / 12) * 440;
  return {
    empty: !1,
    acc: r,
    alt: u,
    chroma: m,
    coord: o,
    freq: M,
    height: p,
    letter: n,
    midi: A,
    name: f,
    oct: a,
    pc: h,
    step: s
  };
}
function nD(e) {
  const { step: t, alt: n, oct: r } = e, i = YP(t);
  if (!i)
    return "";
  const s = i + es(n);
  return r || r === 0 ? s + r : s;
}
function $t(e, t) {
  const n = Se(e), r = Array.isArray(t) ? t : nn(t).coord;
  if (n.empty || !r || r.length < 2)
    return "";
  const i = n.coord, s = i.length === 1 ? [i[0] + r[0]] : [i[0] + r[0], i[1] + r[1]];
  return QP(s).name;
}
function Nm(e, t) {
  const n = e.length;
  return (r) => {
    if (!t) return "";
    const i = r < 0 ? (n - -r % n) % n : r % n, s = Math.floor(r / n), u = $t(t, [0, s]);
    return $t(u, e[i]);
  };
}
function ts(e, t) {
  const n = Se(e), r = Se(t);
  if (n.empty || r.empty)
    return "";
  const i = n.coord, s = r.coord, u = s[0] - i[0], a = i.length === 2 && s.length === 2 ? s[1] - i[1] : -Math.floor(u * 7 / 12), o = r.height === n.height && r.midi !== null && n.oct === r.oct && n.step > r.step;
  return Im([u, a], o).name;
}
var zo = (e, t) => Array(t + 1).join(e), rD = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;
function Tm(e) {
  const t = rD.exec(e);
  return t ? [t[1], t[2], t[3]] : ["", "", ""];
}
function Gi(e) {
  const [t, n, r] = Tm(e);
  if (n === "")
    return "";
  let i = 4;
  for (let u = 0; u < r.length; u++)
    i += r.charAt(u) === "," ? -1 : 1;
  const s = t[0] === "_" ? t.replace(/_/g, "b") : t[0] === "^" ? t.replace(/\^/g, "#") : "";
  return n.charCodeAt(0) > 96 ? n.toUpperCase() + s + (i + 1) : n + s + i;
}
function Lm(e) {
  const t = Se(e);
  if (t.empty || !t.oct && t.oct !== 0)
    return "";
  const { letter: n, acc: r, oct: i } = t, s = r[0] === "b" ? r.replace(/b/g, "_") : r.replace(/#/g, "^"), u = i > 4 ? n.toLowerCase() : n, a = i === 5 ? "" : i > 4 ? zo("'", i - 5) : zo(",", 4 - i);
  return s + u + a;
}
function iD(e, t) {
  return Lm($t(Gi(e), t));
}
function sD(e, t) {
  return ts(Gi(e), Gi(t));
}
var uD = {
  abcToScientificNotation: Gi,
  scientificToAbcNotation: Lm,
  tokenize: Tm,
  transpose: iD,
  distance: sD
};
function aD(e, t) {
  const n = [];
  for (; t--; n[t] = t + e) ;
  return n;
}
function oD(e, t) {
  const n = [];
  for (; t--; n[t] = e - t) ;
  return n;
}
function cD(e, t) {
  return e < t ? aD(e, t - e + 1) : oD(e, e - t + 1);
}
function lD(e, t) {
  const n = t.length, r = (e % n + n) % n;
  return t.slice(r, n).concat(t.slice(0, r));
}
function fD(e) {
  return e.filter((t) => t === 0 || t);
}
function Rm(e) {
  return e.map((n) => Se(n)).filter((n) => !n.empty).sort((n, r) => n.height - r.height).map((n) => n.name);
}
function hD(e) {
  return Rm(e).filter((t, n, r) => n === 0 || t !== r[n - 1]);
}
function pD(e, t = Math.random) {
  let n, r, i = e.length;
  for (; i; )
    n = Math.floor(t() * i--), r = e[i], e[i] = e[n], e[n] = r;
  return e;
}
function Gm(e) {
  return e.length === 0 ? [[]] : Gm(e.slice(1)).reduce((t, n) => t.concat(
    e.map((r, i) => {
      const s = n.slice();
      return s.splice(i, 0, e[0]), s;
    })
  ), []);
}
const dD = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  compact: fD,
  permutations: Gm,
  range: cD,
  rotate: lD,
  shuffle: pD,
  sortedNoteNames: Rm,
  sortedUniqNoteNames: hD
}, Symbol.toStringTag, { value: "Module" }));
function mD(e, t) {
  const n = [];
  for (; t--; n[t] = t + e) ;
  return n;
}
function gD(e, t) {
  const n = [];
  for (; t--; n[t] = e - t) ;
  return n;
}
function ns(e, t) {
  return e < t ? mD(e, t - e + 1) : gD(e, e - t + 1);
}
function Er(e, t) {
  const n = t.length, r = (e % n + n) % n;
  return t.slice(r, n).concat(t.slice(0, r));
}
function ga(e) {
  return e.filter((t) => t === 0 || t);
}
function yD(e, t = Math.random) {
  let n, r, i = e.length;
  for (; i; )
    n = Math.floor(t() * i--), r = e[i], e[i] = e[n], e[n] = r;
  return e;
}
function Xm(e) {
  return e.length === 0 ? [[]] : Xm(e.slice(1)).reduce((t, n) => t.concat(
    e.map((r, i) => {
      const s = n.slice();
      return s.splice(i, 0, e[0]), s;
    })
  ), []);
}
var bD = {
  compact: ga,
  permutations: Xm,
  range: ns,
  rotate: Er,
  shuffle: yD
}, Nn = {
  empty: !0,
  name: "",
  setNum: 0,
  chroma: "000000000000",
  normalized: "000000000000",
  intervals: []
}, ya = (e) => Number(e).toString(2).padStart(12, "0"), jo = (e) => parseInt(e, 2), AD = /^[01]{12}$/;
function ba(e) {
  return AD.test(e);
}
var MD = (e) => typeof e == "number" && e >= 0 && e <= 4095, CD = (e) => e && ba(e.chroma), $o = { [Nn.chroma]: Nn };
function rt(e) {
  const t = ba(e) ? e : MD(e) ? ya(e) : Array.isArray(e) ? ID(e) : CD(e) ? e.chroma : Nn.chroma;
  return $o[t] = $o[t] || kD(t);
}
var vD = rt, Zm = (e) => rt(e).chroma, PD = (e) => rt(e).intervals, DD = (e) => rt(e).setNum, FD = [
  "1P",
  "2m",
  "2M",
  "3m",
  "3M",
  "4P",
  "5d",
  "5P",
  "6m",
  "6M",
  "7m",
  "7M"
];
function ED(e) {
  const t = [];
  for (let n = 0; n < 12; n++)
    e.charAt(n) === "1" && t.push(FD[n]);
  return t;
}
function xD(e) {
  return rt(e).intervals.map((t) => $t("C", t));
}
function wD() {
  return ns(2048, 4095).map(ya);
}
function Aa(e, t = !0) {
  const r = rt(e).chroma.split("");
  return ga(
    r.map((i, s) => {
      const u = Er(s, r);
      return t && u[0] === "0" ? null : u.join("");
    })
  );
}
function SD(e, t) {
  return rt(e).setNum === rt(t).setNum;
}
function rs(e) {
  const t = rt(e).setNum;
  return (n) => {
    const r = rt(n).setNum;
    return t && t !== r && (r & t) === r;
  };
}
function is(e) {
  const t = rt(e).setNum;
  return (n) => {
    const r = rt(n).setNum;
    return t && t !== r && (r | t) === r;
  };
}
function Wm(e) {
  const t = rt(e);
  return (n) => {
    const r = Se(n);
    return t && !r.empty && t.chroma.charAt(r.chroma) === "1";
  };
}
function BD(e) {
  const t = Wm(e);
  return (n) => n.filter(t);
}
var Om = {
  get: rt,
  chroma: Zm,
  num: DD,
  intervals: PD,
  chromas: wD,
  isSupersetOf: is,
  isSubsetOf: rs,
  isNoteIncludedIn: Wm,
  isEqual: SD,
  filter: BD,
  modes: Aa,
  notes: xD,
  // deprecated
  pcset: vD
};
function _D(e) {
  const t = e.split("");
  return t.map((n, r) => Er(r, t).join(""));
}
function kD(e) {
  const t = jo(e), n = _D(e).map(jo).filter((s) => s >= 2048).sort()[0], r = ya(n), i = ED(e);
  return {
    empty: !1,
    name: "",
    setNum: t,
    chroma: e,
    normalized: r,
    intervals: i
  };
}
function ID(e) {
  if (e.length === 0)
    return Nn.chroma;
  let t;
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let r = 0; r < e.length; r++)
    t = Se(e[r]), t.empty && (t = nn(e[r])), t.empty || (n[t.chroma] = 1);
  return n.join("");
}
var VD = [
  // ==Major==
  ["1P 3M 5P", "major", "M ^  maj"],
  ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"],
  ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"],
  ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
  ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
  ["1P 3M 5P 6M 9M", "sixth added ninth", "6add9 6/9 69 M69"],
  ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
  [
    "1P 3M 5P 7M 11A",
    "major seventh sharp eleventh",
    "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"
  ],
  // ==Minor==
  // '''Normal'''
  ["1P 3m 5P", "minor", "m min -"],
  ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
  [
    "1P 3m 5P 7M",
    "minor/major seventh",
    "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7 -maj7"
  ],
  ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
  ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
  ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
  ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
  ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
  // '''Diminished'''
  ["1P 3m 5d", "diminished", "dim ° o"],
  ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"],
  ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"],
  // ==Dominant/Seventh==
  // '''Normal'''
  ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
  ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
  ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
  ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
  // '''Altered'''
  ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
  ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
  ["1P 3M 7m 9m", "altered", "alt7"],
  // '''Suspended'''
  ["1P 4P 5P", "suspended fourth", "sus4 sus"],
  ["1P 2M 5P", "suspended second", "sus2"],
  ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
  ["1P 5P 7m 9M 11P", "eleventh", "11"],
  [
    "1P 4P 5P 7m 9m",
    "suspended fourth flat ninth",
    "b9sus phryg 7b9sus 7b9sus4"
  ],
  // ==Other==
  ["1P 5P", "fifth", "5"],
  ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
  ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
  ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
  [
    "1P 3M 5P 7M 9M 11A",
    "major sharp eleventh (lydian)",
    "maj9#11 Δ9#11 ^9#11"
  ],
  // ==Legacy==
  ["1P 2M 4P 5P", "", "sus24 sus4add9"],
  ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
  ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
  ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
  ["1P 3M 5A 7m 9M", "", "9#5 9+"],
  ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
  ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
  ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
  ["1P 3M 5A 9A", "", "+add#9"],
  ["1P 3M 5A 9M", "", "M#5add9 +add9"],
  ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
  ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
  ["1P 3M 5P 6M 9M 11A", "", "69#11"],
  ["1P 3m 5P 6M 9M", "", "m69 -69"],
  ["1P 3M 5P 6m 7m", "", "7b6"],
  ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
  ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
  ["1P 3M 5P 7M 9m", "", "M7b9"],
  ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
  ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
  ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
  ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
  ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
  ["1P 3M 5P 7m 9A 13M", "", "13#9"],
  ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
  ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
  ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
  ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
  ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
  ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
  ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
  ["1P 3M 5P 7m 9m 13M", "", "13b9"],
  ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
  ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
  ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
  ["1P 3M 5P 9m", "", "Maddb9"],
  ["1P 3M 5d", "", "Mb5"],
  ["1P 3M 5d 6M 7m 9M", "", "13b5"],
  ["1P 3M 5d 7M", "", "M7b5"],
  ["1P 3M 5d 7M 9M", "", "M9b5"],
  ["1P 3M 5d 7m", "", "7b5"],
  ["1P 3M 5d 7m 9M", "", "9b5"],
  ["1P 3M 7m", "", "7no5"],
  ["1P 3M 7m 13m", "", "7b13"],
  ["1P 3M 7m 9M", "", "9no5"],
  ["1P 3M 7m 9M 13M", "", "13no5"],
  ["1P 3M 7m 9M 13m", "", "9b13"],
  ["1P 3m 4P 5P", "", "madd4"],
  ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
  ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
  ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
  ["1P 3m 5P 9M", "", "madd9"],
  ["1P 3m 5d 6M 7M", "", "o7M7"],
  ["1P 3m 5d 7M", "", "oM7"],
  ["1P 3m 6m 7M", "", "mb6M7"],
  ["1P 3m 6m 7m", "", "m7#5"],
  ["1P 3m 6m 7m 9M", "", "m9#5"],
  ["1P 3m 5A 7m 9M 11P", "", "m11A"],
  ["1P 3m 6m 9m", "", "mb6b9"],
  ["1P 2M 3m 5d 7m", "", "m9b5"],
  ["1P 4P 5A 7M", "", "M7#5sus4"],
  ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
  ["1P 4P 5A 7m", "", "7#5sus4"],
  ["1P 4P 5P 7M", "", "M7sus4"],
  ["1P 4P 5P 7M 9M", "", "M9sus4"],
  ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
  ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
  ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
  ["1P 4P 7m 10m", "", "4 quartal"],
  ["1P 5P 7m 9m 11P", "", "11b9"]
], ND = VD;
({
  ...Nn
});
var Ma = [], Fi = {};
function zm() {
  return Ma.slice();
}
function TD(e, t, n) {
  const r = RD(e), i = {
    ...rt(e),
    name: n || "",
    quality: r,
    intervals: e,
    aliases: t
  };
  Ma.push(i), i.name && (Fi[i.name] = i), Fi[i.setNum] = i, Fi[i.chroma] = i, i.aliases.forEach((s) => LD(i, s));
}
function LD(e, t) {
  Fi[t] = e;
}
function RD(e) {
  const t = (n) => e.indexOf(n) !== -1;
  return t("5A") ? "Augmented" : t("3M") ? "Major" : t("5d") ? "Diminished" : t("3m") ? "Minor" : "Unknown";
}
ND.forEach(
  ([e, t, n]) => TD(e.split(" "), n.split(" "), t)
);
Ma.sort((e, t) => e.setNum - t.setNum);
var GD = (e) => {
  const t = e.reduce((n, r) => {
    const i = Se(r).chroma;
    return i !== void 0 && (n[i] = n[i] || Se(r).name), n;
  }, {});
  return (n) => t[n];
};
function XD(e, t = {}) {
  const n = e.map((i) => Se(i).pc).filter((i) => i);
  return Se.length === 0 ? [] : qD(n, 1, t).filter((i) => i.weight).sort((i, s) => s.weight - i.weight).map((i) => i.name);
}
var ss = {
  // 3m 000100000000
  // 3M 000010000000
  anyThirds: 384,
  // 5P 000000010000
  perfectFifth: 16,
  // 5d 000000100000
  // 5A 000000001000
  nonPerfectFifths: 40,
  anySeventh: 3
}, us = (e) => (t) => !!(t & e), ZD = us(ss.anyThirds), WD = us(ss.perfectFifth), OD = us(ss.anySeventh), zD = us(ss.nonPerfectFifths);
function jD(e) {
  const t = parseInt(e.chroma, 2);
  return ZD(t) && WD(t) && OD(t);
}
function $D(e) {
  const t = parseInt(e, 2);
  return zD(t) ? e : (t | 16).toString(2);
}
function qD(e, t, n) {
  const r = e[0], i = Se(r).chroma, s = GD(e), u = Aa(e, !1), a = [];
  return u.forEach((o, f) => {
    const h = n.assumePerfectFifth && $D(o);
    zm().filter((p) => n.assumePerfectFifth && jD(p) ? p.chroma === h : p.chroma === o).forEach((p) => {
      const A = p.aliases[0], M = s(f);
      f !== i ? a.push({
        weight: 0.5 * t,
        name: `${M}${A}/${r}`
      }) : a.push({ weight: 1 * t, name: `${M}${A}` });
    });
  }), a;
}
function ai(e) {
  return e !== null && typeof e == "object" && "name" in e && typeof e.name == "string";
}
var jm = [0, 2, 4, 5, 7, 9, 11], $m = ({ step: e, alt: t }) => (jm[e] + t + 120) % 12, Ca = ({ step: e, alt: t, oct: n, dir: r = 1 }) => r * (jm[e] + t + 12 * (n === void 0 ? -100 : n)), qm = (e) => {
  const t = Ca(e);
  return e.oct !== void 0 && t >= -12 && t <= 115 ? t + 12 : null;
};
function as(e) {
  return e !== null && typeof e == "object" && "step" in e && typeof e.step == "number" && "alt" in e && typeof e.alt == "number";
}
var Km = [0, 2, 4, -1, 1, 3, 5], Hm = Km.map(
  (e) => Math.floor(e * 7 / 12)
);
function os(e) {
  const { step: t, alt: n, oct: r, dir: i = 1 } = e, s = Km[t] + 7 * n;
  if (r === void 0)
    return [i * s];
  const u = r - Hm[t] - 4 * n;
  return [i * s, i * u];
}
var KD = [3, 0, 4, 1, 5, 2, 6];
function cs(e) {
  const [t, n, r] = e, i = KD[HD(t)], s = Math.floor((t + 1) / 7);
  if (n === void 0)
    return { step: i, alt: s, dir: r };
  const u = n + 4 * s + Hm[i];
  return { step: i, alt: s, oct: u, dir: r };
}
function HD(e) {
  const t = (e + 1) % 7;
  return t < 0 ? 7 + t : t;
}
var qo = (e, t) => Array(Math.abs(t) + 1).join(e), du = { empty: !0, name: "", acc: "" }, JD = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})", YD = "(AA|A|P|M|m|d|dd)([-+]?\\d+)", UD = new RegExp(
  "^" + JD + "|" + YD + "$"
);
function va(e) {
  const t = UD.exec(`${e}`);
  return t === null ? ["", ""] : t[1] ? [t[1], t[2]] : [t[4], t[3]];
}
var Ko = {};
function st(e) {
  return typeof e == "string" ? Ko[e] || (Ko[e] = QD(e)) : as(e) ? st(t5(e)) : ai(e) ? st(e.name) : du;
}
var Ho = [0, 2, 4, 5, 7, 9, 11], Jm = "PMMPPMM";
function QD(e) {
  const t = va(e);
  if (t[0] === "")
    return du;
  const n = +t[0], r = t[1], i = (Math.abs(n) - 1) % 7, s = Jm[i];
  if (s === "M" && r === "P")
    return du;
  const u = s === "M" ? "majorable" : "perfectable", a = "" + n + r, o = n < 0 ? -1 : 1, f = n === 8 || n === -8 ? n : o * (i + 1), h = e5(u, r), m = Math.floor((Math.abs(n) - 1) / 7), p = o * (Ho[i] + h + 12 * m), A = (o * (Ho[i] + h) % 12 + 12) % 12, M = os({ step: i, alt: h, oct: m, dir: o });
  return {
    empty: !1,
    name: a,
    num: n,
    q: r,
    step: i,
    alt: h,
    dir: o,
    type: u,
    simple: f,
    semitones: p,
    chroma: A,
    coord: M,
    oct: m
  };
}
function oi(e, t) {
  const [n, r = 0] = e, i = n * 7 + r * 12 < 0, s = t || i ? [-n, -r, -1] : [n, r, 1];
  return st(cs(s));
}
function e5(e, t) {
  return t === "M" && e === "majorable" || t === "P" && e === "perfectable" ? 0 : t === "m" && e === "majorable" ? -1 : /^A+$/.test(t) ? t.length : /^d+$/.test(t) ? -1 * (e === "perfectable" ? t.length : t.length + 1) : 0;
}
function t5(e) {
  const { step: t, alt: n, oct: r = 0, dir: i } = e;
  if (!i)
    return "";
  const s = t + 1 + 7 * r, u = s === 0 ? t + 1 : s, a = i < 0 ? "-" : "", o = Jm[t] === "M" ? "majorable" : "perfectable";
  return a + u + n5(o, n);
}
function n5(e, t) {
  return t === 0 ? e === "majorable" ? "M" : "P" : t === -1 && e === "majorable" ? "m" : t > 0 ? qo("A", t) : qo("d", e === "perfectable" ? t : t + 1);
}
var Jo = (e, t) => Array(Math.abs(t) + 1).join(e), Ym = { empty: !0, name: "", pc: "", acc: "" }, Yo = /* @__PURE__ */ new Map(), Pa = (e) => "CDEFGAB".charAt(e), Da = (e) => e < 0 ? Jo("b", -e) : Jo("#", e), Fa = (e) => e[0] === "b" ? -e.length : e.length;
function rn(e) {
  const t = JSON.stringify(e), n = Yo.get(t);
  if (n)
    return n;
  const r = typeof e == "string" ? s5(e) : as(e) ? rn(u5(e)) : ai(e) ? rn(e.name) : Ym;
  return Yo.set(t, r), r;
}
var r5 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
function ls(e) {
  const t = r5.exec(e);
  return t ? [t[1].toUpperCase(), t[2].replace(/x/g, "##"), t[3], t[4]] : ["", "", "", ""];
}
function Ea(e) {
  return rn(cs(e));
}
var i5 = (e, t) => (e % t + t) % t, $s = [0, 2, 4, 5, 7, 9, 11];
function s5(e) {
  const t = ls(e);
  if (t[0] === "" || t[3] !== "")
    return Ym;
  const n = t[0], r = t[1], i = t[2], s = (n.charCodeAt(0) + 3) % 7, u = Fa(r), a = i.length ? +i : void 0, o = os({ step: s, alt: u, oct: a }), f = n + r + i, h = n + r, m = ($s[s] + u + 120) % 12, p = a === void 0 ? i5($s[s] + u, 12) - 12 * 99 : $s[s] + u + 12 * (a + 1), A = p >= 0 && p <= 127 ? p : null, M = a === void 0 ? null : Math.pow(2, (p - 69) / 12) * 440;
  return {
    empty: !1,
    acc: r,
    alt: u,
    chroma: m,
    coord: o,
    freq: M,
    height: p,
    letter: n,
    midi: A,
    name: f,
    oct: a,
    pc: h,
    step: s
  };
}
function u5(e) {
  const { step: t, alt: n, oct: r } = e, i = Pa(t);
  if (!i)
    return "";
  const s = i + Da(n);
  return r || r === 0 ? s + r : s;
}
function gr(e, t) {
  const n = rn(e), r = Array.isArray(t) ? t : st(t).coord;
  if (n.empty || !r || r.length < 2)
    return "";
  const i = n.coord, s = i.length === 1 ? [i[0] + r[0]] : [i[0] + r[0], i[1] + r[1]];
  return Ea(s).name;
}
function fs(e, t) {
  const n = e.length;
  return (r) => {
    if (!t)
      return "";
    const i = r < 0 ? (n - -r % n) % n : r % n, s = Math.floor(r / n), u = gr(t, [0, s]);
    return gr(u, e[i]);
  };
}
function xa(e, t) {
  const n = rn(e), r = rn(t);
  if (n.empty || r.empty)
    return "";
  const i = n.coord, s = r.coord, u = s[0] - i[0], a = i.length === 2 && s.length === 2 ? s[1] - i[1] : -Math.floor(u * 7 / 12), o = r.height === n.height && r.midi !== null && n.midi !== null && n.step > r.step;
  return oi([u, a], o).name;
}
var Um = (e, t) => Array(Math.abs(t) + 1).join(e);
function xr(e, t, n) {
  return function(...r) {
    return console.warn(`${e} is deprecated. Use ${t}.`), n.apply(this, r);
  };
}
var Qm = xr("isNamed", "isNamedPitch", ai);
const eg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accToAlt: Fa,
  altToAcc: Da,
  chroma: $m,
  coordToInterval: oi,
  coordToNote: Ea,
  coordinates: os,
  deprecate: xr,
  distance: xa,
  fillStr: Um,
  height: Ca,
  interval: st,
  isNamed: Qm,
  isNamedPitch: ai,
  isPitch: as,
  midi: qm,
  note: rn,
  pitch: cs,
  stepToLetter: Pa,
  tokenizeInterval: va,
  tokenizeNote: ls,
  tonicIntervalsTransposer: fs,
  transpose: gr
}, Symbol.toStringTag, { value: "Module" }));
var a5 = [
  ["1P 3M 5P", "major", "M ^  maj"],
  ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"],
  ["1P 3M 5P 7M 9M", "major ninth", "maj9 Δ9 ^9"],
  ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
  ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
  ["1P 3M 5P 6M 9M", "sixth added ninth", "6add9 6/9 69 M69"],
  ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
  [
    "1P 3M 5P 7M 11A",
    "major seventh sharp eleventh",
    "maj#4 Δ#4 Δ#11 M7#11 ^7#11 maj7#11"
  ],
  ["1P 3m 5P", "minor", "m min -"],
  ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
  [
    "1P 3m 5P 7M",
    "minor/major seventh",
    "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7"
  ],
  ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
  ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
  ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
  ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
  ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
  ["1P 3m 5d", "diminished", "dim ° o"],
  ["1P 3m 5d 7d", "diminished seventh", "dim7 °7 o7"],
  ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"],
  ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
  ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
  ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
  ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
  ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
  ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
  ["1P 3M 7m 9m", "altered", "alt7"],
  ["1P 4P 5P", "suspended fourth", "sus4 sus"],
  ["1P 2M 5P", "suspended second", "sus2"],
  ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
  ["1P 5P 7m 9M 11P", "eleventh", "11"],
  [
    "1P 4P 5P 7m 9m",
    "suspended fourth flat ninth",
    "b9sus phryg 7b9sus 7b9sus4"
  ],
  ["1P 5P", "fifth", "5"],
  ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
  ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
  ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
  [
    "1P 3M 5P 7M 9M 11A",
    "major sharp eleventh (lydian)",
    "maj9#11 Δ9#11 ^9#11"
  ],
  ["1P 2M 4P 5P", "", "sus24 sus4add9"],
  ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
  ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
  ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
  ["1P 3M 5A 7m 9M", "", "9#5 9+"],
  ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
  ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
  ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
  ["1P 3M 5A 9A", "", "+add#9"],
  ["1P 3M 5A 9M", "", "M#5add9 +add9"],
  ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
  ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
  ["1P 3M 5P 6M 9M 11A", "", "69#11"],
  ["1P 3m 5P 6M 9M", "", "m69 -69"],
  ["1P 3M 5P 6m 7m", "", "7b6"],
  ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
  ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
  ["1P 3M 5P 7M 9m", "", "M7b9"],
  ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
  ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
  ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
  ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
  ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
  ["1P 3M 5P 7m 9A 13M", "", "13#9"],
  ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
  ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
  ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
  ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
  ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
  ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
  ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
  ["1P 3M 5P 7m 9m 13M", "", "13b9"],
  ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
  ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
  ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
  ["1P 3M 5P 9m", "", "Maddb9"],
  ["1P 3M 5d", "", "Mb5"],
  ["1P 3M 5d 6M 7m 9M", "", "13b5"],
  ["1P 3M 5d 7M", "", "M7b5"],
  ["1P 3M 5d 7M 9M", "", "M9b5"],
  ["1P 3M 5d 7m", "", "7b5"],
  ["1P 3M 5d 7m 9M", "", "9b5"],
  ["1P 3M 7m", "", "7no5"],
  ["1P 3M 7m 13m", "", "7b13"],
  ["1P 3M 7m 9M", "", "9no5"],
  ["1P 3M 7m 9M 13M", "", "13no5"],
  ["1P 3M 7m 9M 13m", "", "9b13"],
  ["1P 3m 4P 5P", "", "madd4"],
  ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
  ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
  ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
  ["1P 3m 5P 9M", "", "madd9"],
  ["1P 3m 5d 6M 7M", "", "o7M7"],
  ["1P 3m 5d 7M", "", "oM7"],
  ["1P 3m 6m 7M", "", "mb6M7"],
  ["1P 3m 6m 7m", "", "m7#5"],
  ["1P 3m 6m 7m 9M", "", "m9#5"],
  ["1P 3m 5A 7m 9M 11P", "", "m11A"],
  ["1P 3m 6m 9m", "", "mb6b9"],
  ["1P 2M 3m 5d 7m", "", "m9b5"],
  ["1P 4P 5A 7M", "", "M7#5sus4"],
  ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
  ["1P 4P 5A 7m", "", "7#5sus4"],
  ["1P 4P 5P 7M", "", "M7sus4"],
  ["1P 4P 5P 7M 9M", "", "M9sus4"],
  ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
  ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
  ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
  ["1P 4P 7m 10m", "", "4 quartal"],
  ["1P 5P 7m 9m 11P", "", "11b9"]
], o5 = a5, c5 = {
  ...Nn,
  name: "",
  quality: "Unknown",
  intervals: [],
  aliases: []
}, wr = [], $n = {};
function wa(e) {
  return $n[e] || c5;
}
var l5 = xr("ChordType.chordType", "ChordType.get", wa);
function f5() {
  return wr.map((e) => e.name).filter((e) => e);
}
function h5() {
  return wr.map((e) => e.aliases[0]).filter((e) => e);
}
function p5() {
  return Object.keys($n);
}
function hs() {
  return wr.slice();
}
var d5 = xr("ChordType.entries", "ChordType.all", hs);
function m5() {
  wr = [], $n = {};
}
function tg(e, t, n) {
  const r = y5(e), i = {
    ...rt(e),
    name: n || "",
    quality: r,
    intervals: e,
    aliases: t
  };
  wr.push(i), i.name && ($n[i.name] = i), $n[i.setNum] = i, $n[i.chroma] = i, i.aliases.forEach((s) => g5(i, s));
}
function g5(e, t) {
  $n[t] = e;
}
function y5(e) {
  const t = (n) => e.indexOf(n) !== -1;
  return t("5A") ? "Augmented" : t("3M") ? "Major" : t("5d") ? "Diminished" : t("3m") ? "Minor" : "Unknown";
}
o5.forEach(
  ([e, t, n]) => tg(e.split(" "), n.split(" "), t)
);
wr.sort((e, t) => e.setNum - t.setNum);
var ng = {
  names: f5,
  symbols: h5,
  get: wa,
  all: hs,
  add: tg,
  removeAll: m5,
  keys: p5,
  entries: d5,
  chordType: l5
}, b5 = [
  // Basic scales
  ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
  ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
  ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian"],
  // Jazz common scales
  ["1P 2M 3m 3M 5P 6M", "major blues"],
  ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
  ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
  ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
  ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
  ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
  // Modes
  ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
  ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
  ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
  ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
  ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
  // 5-note scales
  ["1P 3M 4P 5P 7M", "ionian pentatonic"],
  ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
  ["1P 2M 4P 5P 6M", "ritusen"],
  ["1P 2M 4P 5P 7m", "egyptian"],
  ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
  ["1P 3m 4P 5P 6m", "vietnamese 1"],
  ["1P 2m 3m 5P 6m", "pelog"],
  ["1P 2m 4P 5P 6m", "kumoijoshi"],
  ["1P 2M 3m 5P 6m", "hirajoshi"],
  ["1P 2m 4P 5d 7m", "iwato"],
  ["1P 2m 4P 5P 7m", "in-sen"],
  ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
  ["1P 3m 4P 6m 7m", "malkos raga"],
  ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
  ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
  ["1P 3m 4P 5P 6M", "minor six pentatonic"],
  ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
  ["1P 2M 3M 5P 6m", "flat six pentatonic"],
  ["1P 2m 3M 5P 6M", "scriabin"],
  ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
  ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
  ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
  ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
  ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
  // 6-note scales
  ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
  ["1P 2A 3M 5P 5A 7M", "augmented"],
  ["1P 2M 4P 5P 6M 7m", "piongio"],
  ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
  ["1P 2M 3M 4A 6M 7m", "prometheus"],
  ["1P 2m 3M 5d 6m 7m", "mystery #1"],
  ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
  ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"],
  ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
  // 7-note scales
  ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
  ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
  [
    "1P 2m 2A 3M 4A 6m 7m",
    "altered",
    "super locrian",
    "diminished whole tone",
    "pomeroy"
  ],
  ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
  [
    "1P 2M 3M 4P 5P 6m 7m",
    "mixolydian b6",
    "melodic minor fifth mode",
    "hindu"
  ],
  ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
  ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
  [
    "1P 2m 3m 4P 5P 6M 7m",
    "dorian b2",
    "phrygian #6",
    "melodic minor second mode"
  ],
  [
    "1P 2m 3m 4d 5d 6m 7d",
    "ultralocrian",
    "superlocrian bb7",
    "superlocrian diminished"
  ],
  ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
  ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
  // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
  [
    "1P 2M 3m 4A 5P 6M 7m",
    "dorian #4",
    "ukrainian dorian",
    "romanian minor",
    "altered dorian"
  ],
  ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
  ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
  ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
  ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
  ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
  ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"],
  ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
  ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
  ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
  ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
  ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
  ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
  ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
  ["1P 2m 3M 4P 5d 6m 7M", "persian"],
  ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
  [
    "1P 2M 3M 4P 5A 6M 7M",
    "major augmented",
    "major #5",
    "ionian augmented",
    "ionian #5"
  ],
  ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
  // 8-note scales
  ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
  ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
  ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
  ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
  ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
  ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
  ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
  ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
  ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
  [
    "1P 2m 3m 3M 4A 5P 6M 7m",
    "half-whole diminished",
    "dominant diminished",
    "messiaen's mode #2"
  ],
  ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
  ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
  // 9-note scales
  ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
  ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
  // 10-note scales
  ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
  // 12-note scales
  ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]
], A5 = b5, M5 = {
  ...Nn,
  intervals: [],
  aliases: []
}, ps = [], qn = {};
function rg() {
  return ps.map((e) => e.name);
}
function ds(e) {
  return qn[e] || M5;
}
var C5 = ds;
function Sr() {
  return ps.slice();
}
var v5 = Sr;
function P5() {
  return Object.keys(qn);
}
function D5() {
  ps = [], qn = {};
}
function ig(e, t, n = []) {
  const r = { ...rt(e), name: t, intervals: e, aliases: n };
  return ps.push(r), qn[r.name] = r, qn[r.setNum] = r, qn[r.chroma] = r, r.aliases.forEach((i) => F5(r, i)), r;
}
function F5(e, t) {
  qn[t] = e;
}
A5.forEach(
  ([e, t, ...n]) => ig(e.split(" "), t, n)
);
var sg = {
  names: rg,
  get: ds,
  all: Sr,
  add: ig,
  removeAll: D5,
  keys: P5,
  // deprecated
  entries: v5,
  scaleType: C5
}, mu = {
  empty: !0,
  name: "",
  symbol: "",
  root: "",
  rootDegree: 0,
  type: "",
  tonic: null,
  setNum: NaN,
  quality: "Unknown",
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};
function Sa(e) {
  const [t, n, r, i] = ls(e);
  return t === "" ? ["", e] : t === "A" && i === "ug" ? ["", "aug"] : [t + n, r + i];
}
function er(e) {
  if (e === "")
    return mu;
  if (Array.isArray(e) && e.length === 2)
    return Ei(e[1], e[0]);
  {
    const [t, n] = Sa(e), r = Ei(n, t);
    return r.empty ? Ei(e) : r;
  }
}
function Ei(e, t, n) {
  const r = wa(e), i = rn(t || ""), s = rn(n || "");
  if (r.empty || t && i.empty || n && s.empty)
    return mu;
  const u = xa(i.pc, s.pc), a = r.intervals.indexOf(u) + 1;
  if (!s.empty && !a)
    return mu;
  const o = Array.from(r.intervals);
  for (let p = 1; p < a; p++) {
    const A = o[0][0], M = o[0][1], v = parseInt(A, 10) + 7;
    o.push(`${v}${M}`), o.shift();
  }
  const f = i.empty ? [] : o.map((p) => gr(i, p));
  e = r.aliases.indexOf(e) !== -1 ? e : r.aliases[0];
  const h = `${i.empty ? "" : i.pc}${e}${s.empty || a <= 1 ? "" : "/" + s.pc}`, m = `${t ? i.pc + " " : ""}${r.name}${a > 1 && n ? " over " + s.pc : ""}`;
  return {
    ...r,
    name: m,
    symbol: h,
    type: r.name,
    root: s.name,
    intervals: o,
    rootDegree: a,
    tonic: i.name,
    notes: f
  };
}
var E5 = xr("Chord.chord", "Chord.get", er);
function x5(e, t) {
  const [n, r] = Sa(e);
  return n ? gr(n, t) + r : e;
}
function w5(e) {
  const t = er(e), n = is(t.chroma);
  return Sr().filter((r) => n(r.chroma)).map((r) => r.name);
}
function S5(e) {
  const t = er(e), n = is(t.chroma);
  return hs().filter((r) => n(r.chroma)).map((r) => t.tonic + r.aliases[0]);
}
function B5(e) {
  const t = er(e), n = rs(t.chroma);
  return hs().filter((r) => n(r.chroma)).map((r) => t.tonic + r.aliases[0]);
}
function _5(e) {
  const { intervals: t, tonic: n } = er(e), r = fs(t, n);
  return (i) => i ? r(i > 0 ? i - 1 : i) : "";
}
function k5(e) {
  const { intervals: t, tonic: n } = er(e);
  return fs(t, n);
}
var I5 = {
  getChord: Ei,
  get: er,
  detect: XD,
  chordScales: w5,
  extended: S5,
  reduced: B5,
  tokenize: Sa,
  transpose: x5,
  degrees: _5,
  steps: k5,
  chord: E5
}, V5 = [
  [
    0.125,
    "dl",
    ["large", "duplex longa", "maxima", "octuple", "octuple whole"]
  ],
  [0.25, "l", ["long", "longa"]],
  [0.5, "d", ["double whole", "double", "breve"]],
  [1, "w", ["whole", "semibreve"]],
  [2, "h", ["half", "minim"]],
  [4, "q", ["quarter", "crotchet"]],
  [8, "e", ["eighth", "quaver"]],
  [16, "s", ["sixteenth", "semiquaver"]],
  [32, "t", ["thirty-second", "demisemiquaver"]],
  [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]],
  [128, "h", ["hundred twenty-eighth"]],
  [256, "th", ["two hundred fifty-sixth"]]
], N5 = V5, ms = [];
N5.forEach(
  ([e, t, n]) => O5(e, t, n)
);
var T5 = {
  empty: !0,
  name: "",
  value: 0,
  fraction: [0, 0],
  shorthand: "",
  dots: "",
  names: []
};
function L5() {
  return ms.reduce((e, t) => (t.names.forEach((n) => e.push(n)), e), []);
}
function R5() {
  return ms.map((e) => e.shorthand);
}
var G5 = /^([^.]+)(\.*)$/;
function Ba(e) {
  const [t, n, r] = G5.exec(e) || [], i = ms.find(
    (a) => a.shorthand === n || a.names.includes(n)
  );
  if (!i)
    return T5;
  const s = z5(i.fraction, r.length), u = s[0] / s[1];
  return { ...i, name: e, dots: r, value: u, fraction: s };
}
var X5 = (e) => Ba(e).value, Z5 = (e) => Ba(e).fraction, W5 = { names: L5, shorthands: R5, get: Ba, value: X5, fraction: Z5 };
function O5(e, t, n) {
  ms.push({
    empty: !1,
    dots: "",
    name: "",
    value: 1 / e,
    fraction: e < 1 ? [1 / e, 1] : [1, e],
    shorthand: t,
    names: n
  });
}
function z5(e, t) {
  const n = Math.pow(2, t);
  let r = e[0] * n, i = e[1] * n;
  const s = r;
  for (let u = 0; u < t; u++)
    r += s / Math.pow(2, u + 1);
  for (; r % 2 === 0 && i % 2 === 0; )
    r /= 2, i /= 2;
  return [r, i];
}
function j5() {
  return "1P 2M 3M 4P 5P 6m 7m".split(" ");
}
var ug = st, $5 = (e) => st(e).name, q5 = (e) => st(e).semitones, K5 = (e) => st(e).q, H5 = (e) => st(e).num;
function J5(e) {
  const t = st(e);
  return t.empty ? "" : t.simple + t.q;
}
function Y5(e) {
  const t = st(e);
  if (t.empty)
    return "";
  const n = (7 - t.step) % 7, r = t.type === "perfectable" ? -t.alt : -(t.alt + 1);
  return st({ step: n, alt: r, oct: t.oct, dir: t.dir }).name;
}
var U5 = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7], Q5 = "P m M m M P d P m M m M".split(" ");
function e9(e) {
  const t = e < 0 ? -1 : 1, n = Math.abs(e), r = n % 12, i = Math.floor(n / 12);
  return t * (U5[r] + 7 * i) + Q5[r];
}
var t9 = ts, ag = og((e, t) => [e[0] + t[0], e[1] + t[1]]), n9 = (e) => (t) => ag(e, t), r9 = og((e, t) => [e[0] - t[0], e[1] - t[1]]);
function i9(e, t) {
  const n = ug(e);
  if (n.empty)
    return "";
  const [r, i, s] = n.coord;
  return oi([r + t, i, s]).name;
}
var yr = {
  names: j5,
  get: ug,
  name: $5,
  num: H5,
  semitones: q5,
  quality: K5,
  fromSemitones: e9,
  distance: t9,
  invert: Y5,
  simplify: J5,
  add: ag,
  addTo: n9,
  substract: r9,
  transposeFifths: i9
};
function og(e) {
  return (t, n) => {
    const r = st(t).coord, i = st(n).coord;
    if (r && i) {
      const s = e(r, i);
      return oi(s).name;
    }
  };
}
function cg(e) {
  return +e >= 0 && +e <= 127;
}
function lg(e) {
  if (cg(e))
    return +e;
  const t = Se(e);
  return t.empty ? null : t.midi;
}
function s9(e, t = 440) {
  return Math.pow(2, (e - 69) / 12) * t;
}
var u9 = Math.log(2), a9 = Math.log(440);
function _a(e) {
  const t = 12 * (Math.log(e) - a9) / u9 + 69;
  return Math.round(t * 100) / 100;
}
var o9 = "C C# D D# E F F# G G# A A# B".split(" "), c9 = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
function Zn(e, t = {}) {
  if (isNaN(e) || e === -1 / 0 || e === 1 / 0) return "";
  e = Math.round(e);
  const r = (t.sharps === !0 ? o9 : c9)[e % 12];
  if (t.pitchClass)
    return r;
  const i = Math.floor(e / 12) - 1;
  return r + i;
}
function ka(e) {
  return e % 12;
}
function l9(e) {
  return e.split("").reduce((t, n, r) => (r < 12 && n === "1" && t.push(r), t), []);
}
function f9(e) {
  return e.map(ka).sort((t, n) => t - n).filter((t, n, r) => n === 0 || t !== r[n - 1]);
}
function Ia(e) {
  return Array.isArray(e) ? f9(e) : l9(e);
}
function h9(e) {
  const t = Ia(e);
  return (n) => {
    const r = ka(n);
    for (let i = 0; i < 12; i++) {
      if (t.includes(r + i)) return n + i;
      if (t.includes(r - i)) return n - i;
    }
  };
}
function fg(e, t) {
  const n = Ia(e), r = n.length;
  return (i) => {
    const s = i < 0 ? (r - -i % r) % r : i % r, u = Math.floor(i / r);
    return n[s] + u * 12 + t;
  };
}
function p9(e, t) {
  const n = fg(e, t);
  return (r) => {
    if (r !== 0)
      return n(r > 0 ? r - 1 : r);
  };
}
var d9 = {
  chroma: ka,
  freqToMidi: _a,
  isMidi: cg,
  midiToFreq: s9,
  midiToNoteName: Zn,
  pcsetNearest: h9,
  pcset: Ia,
  pcsetDegrees: p9,
  pcsetSteps: fg,
  toMidi: lg
}, m9 = ["C", "D", "E", "F", "G", "A", "B"], hg = (e) => e.name, pg = (e) => e.map(Se).filter((t) => !t.empty);
function g9(e) {
  return e === void 0 ? m9.slice() : Array.isArray(e) ? pg(e).map(hg) : [];
}
var qt = Se, y9 = (e) => qt(e).name, b9 = (e) => qt(e).pc, A9 = (e) => qt(e).acc, M9 = (e) => qt(e).oct, C9 = (e) => qt(e).midi, v9 = (e) => qt(e).freq, P9 = (e) => qt(e).chroma;
function dg(e) {
  return Zn(e);
}
function D9(e) {
  return Zn(_a(e));
}
function F9(e) {
  return Zn(_a(e), { sharps: !0 });
}
function E9(e) {
  return Zn(e, { sharps: !0 });
}
var x9 = ts, zt = $t, w9 = $t, mg = (e) => (t) => zt(t, e), S9 = mg, gg = (e) => (t) => zt(e, t), B9 = gg;
function Xi(e, t) {
  return zt(e, [t, 0]);
}
var _9 = Xi;
function k9(e, t) {
  return zt(e, [0, t]);
}
var Va = (e, t) => e.height - t.height, I9 = (e, t) => t.height - e.height;
function yg(e, t) {
  return t = t || Va, pg(e).sort(t).map(hg);
}
function bg(e) {
  return yg(e, Va).filter(
    (t, n, r) => n === 0 || t !== r[n - 1]
  );
}
var V9 = (e) => {
  const t = qt(e);
  return t.empty ? "" : Zn(t.midi || t.chroma, {
    sharps: t.alt > 0,
    pitchClass: t.midi === null
  });
};
function Ag(e, t) {
  const n = qt(e);
  if (n.empty)
    return "";
  const r = qt(
    t || Zn(n.midi || n.chroma, {
      sharps: n.alt < 0,
      pitchClass: !0
    })
  );
  if (r.empty || r.chroma !== n.chroma)
    return "";
  if (n.oct === void 0)
    return r.pc;
  const i = n.chroma - n.alt, s = r.chroma - r.alt, u = i > 11 || s < 0 ? -1 : i < 0 || s > 11 ? 1 : 0, a = n.oct + u;
  return r.pc + a;
}
var Tn = {
  names: g9,
  get: qt,
  name: y9,
  pitchClass: b9,
  accidentals: A9,
  octave: M9,
  midi: C9,
  ascending: Va,
  descending: I9,
  distance: x9,
  sortedNames: yg,
  sortedUniqNames: bg,
  fromMidi: dg,
  fromMidiSharps: E9,
  freq: v9,
  fromFreq: D9,
  fromFreqSharps: F9,
  chroma: P9,
  transpose: zt,
  tr: w9,
  transposeBy: mg,
  trBy: S9,
  transposeFrom: gg,
  trFrom: B9,
  transposeFifths: Xi,
  transposeOctaves: k9,
  trFifths: _9,
  simplify: V9,
  enharmonic: Ag
}, Mg = { empty: !0, name: "", chordType: "" }, Uo = {};
function Ln(e) {
  return typeof e == "string" ? Uo[e] || (Uo[e] = Z9(e)) : typeof e == "number" ? Ln(gs[e] || "") : pa(e) ? L9(e) : ha(e) ? Ln(e.name) : Mg;
}
var N9 = Ln;
function T9(e = !0) {
  return (e ? gs : X9).slice();
}
function L9(e) {
  return Ln(es(e.alt) + gs[e.step]);
}
var R9 = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
function G9(e) {
  return R9.exec(e) || ["", "", "", ""];
}
var Cg = "I II III IV V VI VII", gs = Cg.split(" "), X9 = Cg.toLowerCase().split(" ");
function Z9(e) {
  const [t, n, r, i] = G9(e);
  if (!r)
    return Mg;
  const s = r.toUpperCase(), u = gs.indexOf(s), a = da(n), o = 1;
  return {
    empty: !1,
    name: t,
    roman: r,
    interval: nn({ step: u, alt: a, dir: o }).name,
    acc: n,
    chordType: i,
    alt: a,
    step: u,
    major: r === s,
    oct: 0,
    dir: o
  };
}
var W9 = {
  names: T9,
  get: Ln,
  // deprecated
  romanNumeral: N9
}, nt = Object.freeze([]), vg = {
  type: "major",
  tonic: "",
  alteration: 0,
  keySignature: ""
}, xi = {
  tonic: "",
  grades: nt,
  intervals: nt,
  scale: nt,
  triads: nt,
  chords: nt,
  chordsHarmonicFunction: nt,
  chordScales: nt,
  secondaryDominants: nt,
  secondaryDominantSupertonics: nt,
  substituteDominantsMinorRelative: nt,
  substituteDominants: nt,
  substituteDominantSupertonics: nt,
  secondaryDominantsMinorRelative: nt
}, O9 = {
  ...vg,
  ...xi,
  type: "major",
  minorRelative: "",
  scale: nt,
  substituteDominants: nt,
  secondaryDominantSupertonics: nt,
  substituteDominantsMinorRelative: nt
}, z9 = {
  ...vg,
  type: "minor",
  relativeMajor: "",
  natural: xi,
  harmonic: xi,
  melodic: xi
}, qs = (e, t, n = "") => t.map((r, i) => `${e[i]}${n}${r}`);
function ys(e, t, n, r, i) {
  return (s) => {
    const u = e.map((A) => Ln(A).interval || ""), a = u.map((A) => zt(s, A)), o = qs(a, n), f = a.map((A) => zt(A, "5P")).map(
      (A) => (
        // A secondary dominant is a V chord which:
        // 1. is not diatonic to the key,
        // 2. it must have a diatonic root.
        a.includes(A) && !o.includes(A + "7") ? A + "7" : ""
      )
    ), h = Qo(
      f,
      t
    ), m = f.map((A) => {
      if (!A) return "";
      const M = A.slice(0, -1);
      return zt(M, "5d") + "7";
    }), p = Qo(
      m,
      t
    );
    return {
      tonic: s,
      grades: e,
      intervals: u,
      scale: a,
      triads: qs(a, t),
      chords: o,
      chordsHarmonicFunction: r.slice(),
      chordScales: qs(a, i, " "),
      secondaryDominants: f,
      secondaryDominantSupertonics: h,
      substituteDominants: m,
      substituteDominantSupertonics: p,
      // @deprecated use secondaryDominantsSupertonic
      secondaryDominantsMinorRelative: h,
      // @deprecated use secondaryDominantsSupertonic
      substituteDominantsMinorRelative: p
    };
  };
}
var Qo = (e, t) => e.map((n, r) => {
  if (!n) return "";
  const i = n.slice(0, -1), s = zt(i, "5P");
  return t[r].endsWith("m") ? s + "m7" : s + "m7b5";
}), Pg = (e, t) => {
  const n = Se(e), r = Se(t);
  return n.empty || r.empty ? 0 : r.coord[0] - n.coord[0];
}, j9 = ys(
  "I II III IV V VI VII".split(" "),
  " m m   m dim".split(" "),
  "maj7 m7 m7 maj7 7 m7 m7b5".split(" "),
  "T SD T SD D T D".split(" "),
  "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(",")
), $9 = ys(
  "I II bIII IV V bVI bVII".split(" "),
  "m dim  m m  ".split(" "),
  "m7 m7b5 maj7 m7 m7 maj7 7".split(" "),
  "T SD T SD D SD SD".split(" "),
  "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(",")
), q9 = ys(
  "I II bIII IV V bVI VII".split(" "),
  "m dim aug m   dim".split(" "),
  "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "),
  "T SD T SD D SD D".split(" "),
  "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(
    ","
  )
), K9 = ys(
  "I II bIII IV V VI VII".split(" "),
  "m m aug   dim dim".split(" "),
  "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "),
  "T SD T SD D  ".split(" "),
  "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(
    ","
  )
);
function H9(e) {
  const t = Se(e).pc;
  if (!t) return O9;
  const n = j9(t), r = Pg("C", t);
  return {
    ...n,
    type: "major",
    minorRelative: zt(t, "-3m"),
    alteration: r,
    keySignature: es(r)
  };
}
function J9(e) {
  const t = Se(e).pc;
  if (!t) return z9;
  const n = Pg("C", t) - 3;
  return {
    type: "minor",
    tonic: t,
    relativeMajor: zt(t, "3m"),
    alteration: n,
    keySignature: es(n),
    natural: $9(t),
    harmonic: q9(t),
    melodic: K9(t)
  };
}
function Y9(e) {
  return typeof e == "number" ? Xi("C", e) : typeof e == "string" && /^b+|#+$/.test(e) ? Xi("C", da(e)) : null;
}
var U9 = { majorKey: H9, majorTonicFromKeySignature: Y9, minorKey: J9 }, Q9 = nn;
function e7(e) {
  const t = nn(e);
  return t.empty ? "" : t.simple + t.q;
}
function t7(e, t) {
  const n = Q9(e);
  if (n.empty) return "";
  const [r, i, s] = n.coord;
  return Im([r + t, i, s]).name;
}
var Na = [
  [0, 2773, 0, "ionian", "", "Maj7", "major"],
  [1, 2902, 2, "dorian", "m", "m7"],
  [2, 3418, 4, "phrygian", "m", "m7"],
  [3, 2741, -1, "lydian", "", "Maj7"],
  [4, 2774, 1, "mixolydian", "", "7"],
  [5, 2906, 3, "aeolian", "m", "m7", "minor"],
  [6, 3434, 5, "locrian", "dim", "m7b5"]
], ec = {
  ...Nn,
  name: "",
  alt: 0,
  modeNum: NaN,
  triad: "",
  seventh: "",
  aliases: []
}, Ta = Na.map(s7), gu = {};
Ta.forEach((e) => {
  gu[e.name] = e, e.aliases.forEach((t) => {
    gu[t] = e;
  });
});
function Yn(e) {
  return typeof e == "string" ? gu[e.toLowerCase()] || ec : e && e.name ? Yn(e.name) : ec;
}
var n7 = Yn;
function Dg() {
  return Ta.slice();
}
var r7 = Dg;
function i7() {
  return Ta.map((e) => e.name);
}
function s7(e) {
  const [t, n, r, i, s, u, a] = e, o = a ? [a] : [], f = Number(n).toString(2);
  return {
    empty: !1,
    intervals: ds(i).intervals,
    modeNum: t,
    chroma: f,
    normalized: f,
    name: i,
    setNum: n,
    alt: r,
    triad: s,
    seventh: u,
    aliases: o
  };
}
function u7(e, t) {
  return Yn(e).intervals.map((n) => $t(t, n));
}
function Fg(e) {
  return (t, n) => {
    const r = Yn(t);
    if (r.empty) return [];
    const i = Er(r.modeNum, e), s = r.intervals.map((u) => $t(n, u));
    return i.map((u, a) => s[a] + u);
  };
}
var a7 = Fg(Na.map((e) => e[4])), o7 = Fg(Na.map((e) => e[5]));
function Eg(e, t) {
  const n = Yn(t), r = Yn(e);
  return n.empty || r.empty ? "" : e7(t7("1P", r.alt - n.alt));
}
function c7(e, t, n) {
  return $t(n, Eg(e, t));
}
var l7 = {
  get: Yn,
  names: i7,
  all: Dg,
  distance: Eg,
  relativeTonic: c7,
  notes: u7,
  triads: a7,
  seventhChords: o7,
  // deprecated
  entries: r7,
  mode: n7
};
function f7(e) {
  const [t, n, r, i] = ma(e);
  return t === "" ? Ks("", e) : t === "A" && i === "ug" ? Ks("", "aug") : Ks(t + n, r + i);
}
function Ks(e, t) {
  const n = t.split("/");
  if (n.length === 1)
    return [e, n[0], ""];
  const [r, i, s, u] = ma(n[1]);
  return r !== "" && s === "" && u === "" ? [e, n[0], r + i] : [e, t, ""];
}
function h7(e, t) {
  return t.map(Ln).map(
    (r) => $t(e, nn(r)) + r.chordType
  );
}
function p7(e, t) {
  return t.map((n) => {
    const [r, i] = f7(n), s = ts(e, r);
    return Ln(nn(s)).name + i;
  });
}
var d7 = { fromRomanNumerals: h7, toRomanNumerals: p7 };
function xg(e) {
  const t = ga(
    e.map((n) => typeof n == "number" ? n : lg(n))
  );
  return !e.length || t.length !== e.length ? [] : t.reduce(
    (n, r) => {
      const i = n[n.length - 1];
      return n.concat(ns(i, r).slice(1));
    },
    [t[0]]
  );
}
function m7(e, t) {
  return xg(e).map((n) => Zn(n, t));
}
var g7 = { numeric: xg, chromatic: m7 }, y7 = {
  empty: !0,
  name: "",
  type: "",
  tonic: null,
  setNum: NaN,
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};
function wg(e) {
  if (typeof e != "string")
    return ["", ""];
  const t = e.indexOf(" "), n = Se(e.substring(0, t));
  if (n.empty) {
    const i = Se(e);
    return i.empty ? ["", e] : [i.name, ""];
  }
  const r = e.substring(n.name.length + 1).toLowerCase();
  return [n.name, r.length ? r : ""];
}
var b7 = rg;
function sn(e) {
  const t = Array.isArray(e) ? e : wg(e), n = Se(t[0]).name, r = ds(t[1]);
  if (r.empty)
    return y7;
  const i = r.name, s = n ? r.intervals.map((a) => $t(n, a)) : [], u = n ? n + " " + i : i;
  return { ...r, name: u, type: i, tonic: n, notes: s };
}
var A7 = sn;
function M7(e, t = {}) {
  const n = Zm(e), r = Se(t.tonic ?? e[0] ?? ""), i = r.chroma;
  if (i === void 0)
    return [];
  const s = n.split("");
  s[i] = "1";
  const u = Er(i, s).join(""), a = Sr().find((f) => f.chroma === u), o = [];
  return a && o.push(r.name + " " + a.name), t.match === "exact" || Sg(u).forEach((f) => {
    o.push(r.name + " " + f);
  }), o;
}
function C7(e) {
  const t = sn(e), n = rs(t.chroma);
  return zm().filter((r) => n(r.chroma)).map((r) => r.aliases[0]);
}
function Sg(e) {
  const t = ba(e) ? e : sn(e).chroma, n = is(t);
  return Sr().filter((r) => n(r.chroma)).map((r) => r.name);
}
function v7(e) {
  const t = rs(sn(e).chroma);
  return Sr().filter((n) => t(n.chroma)).map((n) => n.name);
}
function Bg(e) {
  const t = e.map((i) => Se(i).pc).filter((i) => i), n = t[0], r = bg(t);
  return Er(r.indexOf(n), r);
}
function P7(e) {
  const t = sn(e);
  if (t.empty)
    return [];
  const n = t.tonic ? t.notes : t.intervals;
  return Aa(t.chroma).map((r, i) => {
    const s = sn(r).name;
    return s ? [n[i], s] : ["", ""];
  }).filter((r) => r[0]);
}
function D7(e) {
  const t = Array.isArray(e) ? Bg(e) : sn(e).notes, n = t.map((r) => Se(r).chroma);
  return (r) => {
    const i = Se(typeof r == "number" ? dg(r) : r), s = i.height;
    if (s === void 0) return;
    const u = s % 12, a = n.indexOf(u);
    if (a !== -1)
      return Ag(i.name, t[a]);
  };
}
function F7(e) {
  const t = D7(e);
  return (n, r) => {
    const i = Se(n).height, s = Se(r).height;
    return i === void 0 || s === void 0 ? [] : ns(i, s).map(t).filter((u) => u);
  };
}
function E7(e) {
  const { intervals: t, tonic: n } = sn(e), r = Nm(t, n);
  return (i) => i ? r(i > 0 ? i - 1 : i) : "";
}
function x7(e) {
  const { intervals: t, tonic: n } = sn(e);
  return Nm(t, n);
}
var br = {
  degrees: E7,
  detect: M7,
  extended: Sg,
  get: sn,
  modeNames: P7,
  names: b7,
  rangeOf: F7,
  reduced: v7,
  scaleChords: C7,
  scaleNotes: Bg,
  steps: x7,
  tokenize: wg,
  // deprecated
  scale: A7
}, w7 = {
  empty: !0,
  name: "",
  upper: void 0,
  lower: void 0,
  type: void 0,
  additive: []
}, S7 = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"];
function B7() {
  return S7.slice();
}
var _7 = /^(\d*\d(?:\+\d)*)\/(\d+)$/, tc = /* @__PURE__ */ new Map();
function k7(e) {
  const t = JSON.stringify(e), n = tc.get(t);
  if (n)
    return n;
  const r = N7(La(e));
  return tc.set(t, r), r;
}
function La(e) {
  if (typeof e == "string") {
    const [s, u, a] = _7.exec(e) || [];
    return La([u, a]);
  }
  const [t, n] = e, r = +n;
  if (typeof t == "number")
    return [t, r];
  const i = t.split("+").map((s) => +s);
  return i.length === 1 ? [i[0], r] : [i, r];
}
var I7 = { names: B7, parse: La, get: k7 }, V7 = (e) => Math.log(e) / Math.log(2) % 1 === 0;
function N7([e, t]) {
  const n = Array.isArray(e) ? e.reduce((a, o) => a + o, 0) : e, r = t;
  if (n === 0 || r === 0)
    return w7;
  const i = Array.isArray(e) ? `${e.join("+")}/${t}` : `${e}/${t}`, s = Array.isArray(e) ? e : [], u = r === 4 || r === 2 ? "simple" : r === 8 && n % 3 === 0 ? "compound" : V7(r) ? "irregular" : "irrational";
  return {
    empty: !1,
    name: i,
    type: u,
    upper: n,
    lower: r,
    additive: s
  };
}
var T7 = eg, L7 = Om, R7 = ng, G7 = sg;
const X7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AbcNotation: uD,
  Array: dD,
  Chord: I5,
  ChordDictionary: R7,
  ChordType: ng,
  Collection: bD,
  Core: eg,
  DurationValue: W5,
  Interval: yr,
  Key: U9,
  Midi: d9,
  Mode: l7,
  Note: Tn,
  PcSet: L7,
  Pcset: Om,
  Progression: d7,
  Range: g7,
  RomanNumeral: W9,
  Scale: br,
  ScaleDictionary: G7,
  ScaleType: sg,
  TimeSignature: I7,
  Tonal: T7,
  accToAlt: Fa,
  altToAcc: Da,
  chroma: $m,
  coordToInterval: oi,
  coordToNote: Ea,
  coordinates: os,
  deprecate: xr,
  distance: xa,
  fillStr: Um,
  height: Ca,
  interval: st,
  isNamed: Qm,
  isNamedPitch: ai,
  isPitch: as,
  midi: qm,
  note: rn,
  pitch: cs,
  stepToLetter: Pa,
  tokenizeInterval: va,
  tokenizeNote: ls,
  tonicIntervalsTransposer: fs,
  transpose: gr
}, Symbol.toStringTag, { value: "Module" })), Z7 = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], W7 = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"], O7 = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"], z7 = { b: -1, "#": 1 }, j7 = (e) => {
  const [t, ...n] = e.split("");
  return W7.indexOf(t.toLowerCase()) + n.reduce((r, i) => r + z7[i], 0);
};
function $7(e) {
  const t = (e || "").match(/^([A-G][b#]*)([^/]*)[/]?([A-G][b#]*)?$/);
  return t ? t.slice(1) : [];
}
const yu = (e) => e % 12, _g = (e) => {
  let t = Number(e);
  return isNaN(t) ? yr.semitones(e) : t;
}, bu = (e, t) => {
  if (typeof e == "number")
    return e;
  if (typeof e == "string")
    return Rn(e, t);
}, q7 = (e, t = !1) => {
  const n = Math.floor(e / 12) - 1;
  return (t ? O7 : Z7)[e % 12] + n;
};
function K7(e, t, n = 1) {
  e = e.map((i) => typeof i == "string" ? Rn(i) : i);
  const r = Math.floor(t / e.length) * n * 12;
  return t = St(t, e.length), e[t] + r;
}
function H7(e, t, n) {
  let r = 0, i = 1 / 0;
  return t.forEach((s, u) => {
    const a = Math.abs(s - e);
    (a < i || n) && (r = u, i = a);
  }), r;
}
let Hs = {};
function J7(e, t, n, r) {
  let [i, s] = br.tokenize(t);
  const u = bu(i), a = yu(u);
  if (!Hs[s]) {
    let { intervals: p } = br.get(`C ${s}`);
    Hs[s] = p.map(_g);
  }
  const o = Hs[s];
  if (!o)
    return null;
  let f = u;
  if (n) {
    n = bu(n, 3);
    const p = yu(n), A = St(p - a, 12), M = H7(A, o, r);
    e = e + M, f = n - A;
  }
  const h = Math.floor(e / o.length) * 12;
  return e = St(e, o.length), o[e] + f + h;
}
let nc = {
  below: (e) => e.slice(-1)[0],
  duck: (e) => e.slice(-1)[0],
  above: (e) => e[0],
  root: (e) => e[0]
};
function Y7({ chord: e, dictionary: t, offset: n = 0, n: r, mode: i = "below", anchor: s = "c5", octaves: u = 1 }) {
  const [a, o] = $7(e), f = j7(a);
  s = bu(s?.note || s, 4);
  const h = yu(s), m = t[o].map(
    (B) => (typeof B == "string" ? B.split(" ") : B).map(_g)
  );
  let p, A, M = m.map((B, I) => {
    const V = nc[i](B), q = St(h - V - f, 12);
    return (p === void 0 || q < p) && (p = q, A = I), q;
  });
  i === "root" && (A = 0);
  const v = Math.ceil(n / m.length) * 12, E = St(A + n, m.length), k = m[E], _ = nc[i](k), G = s - M[E] + v, S = k.map((B) => G - _ + B);
  let x = S.map((B) => q7(B));
  return i === "duck" && (x = x.filter((B, I) => S[I] !== s)), r !== void 0 ? [K7(x, r, u)] : x;
}
const U7 = (e) => (e <= 0 ? -1 : 1) + e * 7 + "P";
function Q7(e, t) {
  t = t.replaceAll(":", " "), e = Math.ceil(e);
  let { intervals: n, tonic: r, empty: i } = br.get(t);
  if (i && Un(t) || !i && !r)
    throw new Error('incomplete scale. Make sure to use ":" instead of spaces, example: .scale("C:major")');
  if (i)
    throw new Error(`invalid scale "${t}"`);
  r = r || "C";
  const { pc: s, oct: u = 3 } = Tn.get(r), a = Math.floor(e / n.length), o = St(e, n.length), f = yr.add(n[o], U7(a));
  return Tn.transpose(s + u, f);
}
function rc(e, t, n) {
  let [r, i] = br.tokenize(e), { notes: s } = br.get(`${r} ${i}`);
  if (s = s.map((A) => Tn.get(A).pc), t = Number(t), isNaN(t))
    throw new Error(`scale offset "${t}" not a number`);
  const { pc: u, oct: a = 3 } = Tn.get(n), o = s.indexOf(u);
  if (o === -1)
    throw new Error(`note "${n}" is not in scale "${e}"`);
  let f = o, h = a, m = u;
  const p = Math.sign(t);
  for (; Math.abs(f - o) < Math.abs(t); ) {
    f += p;
    const A = St(f, s.length);
    p < 0 && m[0] === "C" && (h += p), m = s[A], p > 0 && m[0] === "C" && (h += p);
  }
  return m + h;
}
const eF = T("transpose", function(e, t) {
  return t.withHap((n) => {
    const r = n.value.note ?? n.value;
    if (typeof r == "number") {
      let u;
      typeof e == "number" ? u = e : typeof e == "string" && (u = yr.semitones(e) || 0);
      const a = r + u;
      return typeof n.value == "object" ? n.withValue(() => ({ ...n.value, note: a })) : n.withValue(() => a);
    }
    if (typeof r != "string" || !Un(r))
      return Je(`[tonal] transpose: not a note "${r}"`, "warning"), n;
    const i = isNaN(Number(e)) ? String(e) : yr.fromSemitones(e), s = Tn.simplify(Tn.transpose(r, i));
    return typeof n.value == "object" ? n.withValue(() => ({ ...n.value, note: s })) : n.withValue(() => s);
  });
}), tF = T("scaleTranspose", function(e, t) {
  return t.withHap((n) => {
    if (!n.context.scale)
      throw new Error("can only use scaleTranspose after .scale");
    if (typeof n.value == "object")
      return n.withValue(() => ({
        ...n.value,
        note: rc(n.context.scale, Number(e), n.value.note)
      }));
    if (typeof n.value != "string")
      throw new Error("can only use scaleTranspose with notes");
    return n.withValue(() => rc(n.context.scale, Number(e), n.value));
  });
}), nF = T(
  "scale",
  function(e, t) {
    return Array.isArray(e) && (e = e.flat().join(" ")), t.fmap((n) => {
      const r = typeof n == "object";
      let i = r ? n.n : n;
      if (r && delete n.n, Un(i))
        return Ye(i);
      let s = Number(i), u = 0;
      if (isNaN(s)) {
        if (i = String(i), !/^[-+]?\d+(#*|b*){1}$/.test(i))
          return Je(
            `[tonal] invalid scale step "${i}", expected number or integer with optional # b suffixes`,
            "error"
          ), Be;
        const a = i.indexOf("#");
        if (a >= 0)
          s = Number(i.substring(0, a)), u = i.length - a;
        else {
          const o = i.indexOf("b");
          s = Number(i.substring(0, o)), u = o - i.length;
        }
      }
      try {
        let a;
        r && n.anchor ? a = J7(s, e, n.anchor) : a = Q7(s, e), u != 0 && (a = Tn.transpose(a, yr.fromSemitones(u))), n = Ye(r ? { ...n, note: a } : a);
      } catch (a) {
        Je(`[tonal] ${a.message}`, "error"), n = Be;
      }
      return n;
    }).outerJoin().withHap((n) => n.setContext({ ...n.context, scale: e }));
  },
  !0,
  !0
  // preserve step count
);
var Js = {}, Xr = {}, Zr = {}, ic;
function kg() {
  if (ic) return Zr;
  ic = 1, Zr.__esModule = !0, Zr.getBestVoicing = void 0;
  function e(t) {
    var n = t.chord, r = t.range, i = t.finder, s = t.picker, u = t.lastVoicing, a = i(n, r);
    return a.length ? s(a, u) : [];
  }
  return Zr.getBestVoicing = e, Zr;
}
var Wr = {};
const Ig = /* @__PURE__ */ $v(X7);
var Or = {}, sc;
function Vg() {
  if (sc) return Or;
  sc = 1, Or.__esModule = !0, Or.tokenizeChord = void 0;
  function e(t) {
    var n = (t || "").match(/^([A-G][b#]*)([^\/]*)[\/]?([A-G][b#]*)?$/);
    return n ? n.slice(1) : [];
  }
  return Or.tokenizeChord = e, Or;
}
var uc;
function rF() {
  if (uc) return Wr;
  uc = 1, Wr.__esModule = !0, Wr.voicingsInRange = void 0;
  var e = Ig, t = Ng(), n = Vg();
  function r(i, s, u) {
    s === void 0 && (s = t.lefthand), u === void 0 && (u = ["D3", "A4"]);
    var a = (0, n.tokenizeChord)(i), o = a[0], f = a[1];
    if (!s[f])
      return [];
    var h = s[f].map(function(p) {
      return p.split(" ");
    }), m = e.Range.chromatic(u);
    return h.reduce(function(p, A) {
      var M = A.map(function(_) {
        return e.Interval.substract(_, A[0]);
      }), v = e.Note.transpose(o, A[0]), E = m.filter(function(_) {
        return e.Note.chroma(_) === e.Note.chroma(v);
      }).filter(function(_) {
        return e.Note.midi(e.Note.transpose(_, M[M.length - 1])) <= e.Note.midi(u[1]);
      }).map(function(_) {
        return e.Note.enharmonic(_, v);
      }), k = E.map(function(_) {
        return M.map(function(G) {
          return e.Note.transpose(_, G);
        });
      });
      return p.concat(k);
    }, []);
  }
  return Wr.voicingsInRange = r, Wr;
}
var ac;
function Ng() {
  return ac || (ac = 1, function(e) {
    var t = Xr.__assign || function() {
      return t = Object.assign || function(a) {
        for (var o, f = 1, h = arguments.length; f < h; f++) {
          o = arguments[f];
          for (var m in o) Object.prototype.hasOwnProperty.call(o, m) && (a[m] = o[m]);
        }
        return a;
      }, t.apply(this, arguments);
    }, n = Xr.__rest || function(a, o) {
      var f = {};
      for (var h in a) Object.prototype.hasOwnProperty.call(a, h) && o.indexOf(h) < 0 && (f[h] = a[h]);
      if (a != null && typeof Object.getOwnPropertySymbols == "function")
        for (var m = 0, h = Object.getOwnPropertySymbols(a); m < h.length; m++)
          o.indexOf(h[m]) < 0 && Object.prototype.propertyIsEnumerable.call(a, h[m]) && (f[h[m]] = a[h[m]]);
      return f;
    };
    e.__esModule = !0, e.dictionaryVoicing = e.dictionaryVoicingFinder = e.triads = e.guidetones = e.lefthand = void 0;
    var r = kg(), i = rF();
    e.lefthand = {
      m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
      7: ["3M 6M 7m 9M", "7m 9M 10M 13M"],
      "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
      69: ["3M 5P 6A 9M"],
      m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
      "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
      "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
      o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
      "7#11": ["7m 9M 11A 13A"],
      "7#9": ["3M 7m 9A"],
      mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
      m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
    }, e.guidetones = {
      m7: ["3m 7m", "7m 10m"],
      m9: ["3m 7m", "7m 10m"],
      7: ["3M 7m", "7m 10M"],
      "^7": ["3M 7M", "7M 10M"],
      "^9": ["3M 7M", "7M 10M"],
      69: ["3M 6M"],
      6: ["3M 6M", "6M 10M"],
      m7b5: ["3m 7m", "7m 10m"],
      "7b9": ["3M 7m", "7m 10M"],
      "7b13": ["3M 7m", "7m 10M"],
      o7: ["3m 6M", "6M 10m"],
      "7#11": ["3M 7m", "7m 10M"],
      "7#9": ["3M 7m", "7m 10M"],
      mM7: ["3m 7M", "7M 10m"],
      m6: ["3m 6M", "6M 10m"]
    }, e.triads = {
      M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
      m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
      o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
      aug: ["1P 3m 5A", "3m 5A 8P", "5A 8P 10m"]
    };
    var s = function(a) {
      return function(o, f) {
        return (0, i.voicingsInRange)(o, a, f);
      };
    };
    e.dictionaryVoicingFinder = s;
    var u = function(a) {
      var o = a.dictionary, f = a.range, h = n(a, ["dictionary", "range"]);
      return (0, r.getBestVoicing)(t(t({}, h), { range: f, finder: (0, e.dictionaryVoicingFinder)(o) }));
    };
    e.dictionaryVoicing = u;
  }(Xr)), Xr;
}
var zr = {}, oc;
function iF() {
  if (oc) return zr;
  oc = 1, zr.__esModule = !0, zr.minTopNoteDiff = void 0;
  var e = Ig;
  function t(n, r) {
    if (!r)
      return n[0];
    var i = function(s) {
      return Math.abs(e.Note.midi(r[r.length - 1]) - e.Note.midi(s[s.length - 1]));
    };
    return n.reduce(function(s, u) {
      return i(u) < i(s) ? u : s;
    }, n[0]);
  }
  return zr.minTopNoteDiff = t, zr;
}
var cc;
function sF() {
  return cc || (cc = 1, function(e) {
    e.__esModule = !0;
    var t = Ng(), n = iF(), r = kg(), i = Vg();
    e.default = {
      tokenizeChord: i.tokenizeChord,
      getBestVoicing: r.getBestVoicing,
      dictionaryVoicing: t.dictionaryVoicing,
      dictionaryVoicingFinder: t.dictionaryVoicingFinder,
      lefthand: t.lefthand,
      guidetones: t.guidetones,
      triads: t.triads,
      minTopNoteDiff: n.minTopNoteDiff
    };
  }(Js)), Js;
}
var uF = sF();
const lc = /* @__PURE__ */ vm(uF), lr = {
  2: ["1P 5P 8P 9M", "1P 5P 8P 9M 12P", "5P 8P 9M 12P"],
  5: ["1P 5P 8P 12P", "5P 8P 12P 15P"],
  6: ["1P 5P 6M 8P 10M", "1P 5P 8P 10M 13M", "3M 5P 8P 10M 13M", "5P 8P 10M 12P 13M"],
  7: [
    "1P 5P 7m 8P 10M",
    "1P 7m 8P 10M 12P",
    "3M 7m 8P 10M 12P",
    "3M 7m 8P 10M 14m",
    "3M 7m 10M 12P 15P",
    "7m 10M 12P 14m 15P",
    "7m 10M 12P 15P 17M"
  ],
  9: [
    "1P 5P 7m 9M 10M",
    "1P 7m 9M 10M 12P",
    "3M 7m 8P 9M 12P",
    "7m 9M 10M 14m 15P",
    "3M 7m 8P 12P 16M",
    "7m 10M 12P 15P 16M"
  ],
  11: ["1P 5P 7m 9M 11P", "5P 7m 8P 9M 11P", "7m 8P 9M 11P 12P", "7m 8P 11P 12P 16M"],
  13: ["1P 6M 7m 9M 10M", "1P 7m 9M 10M 13M", "3M 7m 8P 9M 13M", "7m 8P 9M 10M 13M", "7m 9M 10M 13M 15P"],
  69: ["1P 5P 6M 9M 10M", "1P 5P 9M 10M 13M", "3M 5P 8P 9M 13M", "5P 8P 9M 10M 13M"],
  add9: ["1P 5P 8P 9M 10M", "1P 5P 9M 10M 12P", "3M 8P 9M 10M 12P", "3M 8P 9M 12P 15P", "5P 8P 9M 12P 17M"],
  "+": [
    "1P 3M 6m 8P 10M",
    "1P 6m 8P 10M 13m",
    "3M 6m 8P 10M 13m",
    "3M 8P 10M 13m 15P",
    "6m 8P 10M 13m 15P",
    "6m 10M 13m 15P 17M"
  ],
  o: ["1P 5d 8P 10m 12d", "3m 8P 10m 12d 15P", "5d 8P 10m 12d 15P"],
  h: [
    "3m 5d 7m 8P 10m",
    "1P 5d 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 7m 8P 10m 14m",
    "5d 8P 10m 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  sus: ["1P 4P 5P 8P", "1P 4P 5P 8P 11P", "5P 8P 11P 12P", "5P 8P 11P 12P 15P"],
  "^": ["1P 5P 8P 10M", "1P 5P 8P 10M 12P", "3M 5P 8P 10M 12P", "3M 8P 10M 12P 15P", "5P 8P 10M 12P 15P"],
  "-": ["1P 3m 5P 8P 10m", "1P 5P 8P 10m 12P", "3m 5P 8P 10m 12P", "5P 8P 10m 12P 15P"],
  "^7": ["1P 5P 7M 10M 12P", "1P 10M 12P 14M", "3M 8P 10M 12P 14M", "5P 8P 10M 12P 14M", "5P 8P 10M 14M 17M"],
  "-7": [
    "1P 3m 5P 7m 10m",
    "1P 5P 7m 10m 12P",
    "3m 7m 8P 10m 12P",
    "3m 7m 8P 10m 14m",
    "5P 7m 8P 10m 14m",
    "7m 10m 12P 14m 15P",
    "5P 8P 10m 14m 17m",
    "7m 10m 12P 15P 17m"
  ],
  "7sus": ["1P 5P 7m 8P 11P", "5P 8P 11P 12P 14m", "7m 8P 11P 12P 14m", "7m 11P 12P 14m 18P"],
  h7: [
    "3m 5d 7m 8P 10m",
    "1P 5d 7m 10m 12d",
    "1P 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 7m 8P 10m 14m",
    "5d 8P 10m 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  o7: [
    "1P 6M 8P 10m 12d",
    "1P 6M 10m 12d 13M",
    "3m 8P 10m 12d 13M",
    "3m 8P 12d 13M 15P",
    "5d 10m 12d 13M 15P",
    "5d 10m 13M 15P 17m",
    "6M 12d 13M 15P 17m",
    "6M 12d 15P 17m 19d"
  ],
  "^9": [
    "1P 5P 7M 9M 10M",
    "1P 7M 9M 10M 12P",
    "3M 7M 8P 9M 12P",
    "3M 7M 8P 12P 16M",
    "5P 8P 10M 14M 16M",
    "7M 8P 10M 12P 16M"
  ],
  "^13": ["1P 6M 7M 9M 10M", "1P 7M 9M 10M 13M", "3M 7M 8P 9M 13M", "3M 7M 8P 13M 16M", "7M 8P 10M 13M 16M"],
  "^7#11": ["1P 5P 7M 10M 12d", "3M 7M 8P 10M 12d", "1P 7M 10M 12d 14M", "3M 7M 8P 12d 14M", "5P 8P 10M 12d 14M"],
  "^9#11": ["1P 3M 5d 7M 9M", "1P 7M 9M 10M 12d", "3M 7M 8P 9M 12d", "3M 8P 9M 12d 14M"],
  "^7#5": ["1P 6m 7M 10M 13m", "3M 7M 8P 10M 13m", "6m 7M 8P 10M 13m"],
  "-6": [
    "1P 3m 5P 6M 8P",
    "1P 5P 6M 8P 10m",
    "3m 5P 6M 8P 10m",
    "1P 5P 8P 10m 13M",
    "3m 5P 8P 10m 13M",
    "5P 8P 10m 12P 13M",
    "5P 8P 10m 13M 15P"
  ],
  "-69": [
    "1P 3m 5P 6M 9M",
    "3m 5P 6M 8P 9M",
    "3m 6M 9M 10m 12P",
    "1P 5P 9M 10m 13M",
    "3m 5P 8P 9M 13M",
    "5P 8P 9M 10m 13M",
    "5P 8P 10m 13M 16M"
  ],
  "-^7": ["1P 3m 5P 7M 10m", "1P 5P 7M 10m 12P", "3m 7M 8P 10m 12P", "5P 7M 8P 10m 14M", "5P 8P 10m 14M 17m"],
  "-^9": ["1P 3m 5P 7M 9M", "1P 7M 9M 10m 12P", "3m 7M 8P 9M 12P", "5P 8P 9M 10m 14M"],
  "-9": [
    "1P 3m 5P 7m 9M",
    "3m 5P 7m 8P 9M",
    "3m 7m 8P 9M 12P",
    "5P 8P 9M 10m 14m",
    "3m 7m 9M 12P 15P",
    "7m 10m 12P 15P 16M"
  ],
  "-add9": ["1P 2M 3m 5P 8P", "1P 3m 5P 9M", "3m 5P 8P 9M 12P", "5P 8P 9M 10m 12P"],
  "-11": [
    "1P 3m 7m 9M 11P",
    "3m 7m 8P 9M 11P",
    "1P 4P 7m 10m 12P",
    "5P 8P 11P 14m",
    "3m 7m 9M 11P 15P",
    "5P 8P 11P 14m 16M",
    "7m 10m 12P 15P 18P"
  ],
  "-7b5": [
    "3m 5d 7m 8P 10m",
    "1P 7m 10m 12d",
    "1P 5d 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 7m 8P 10m 14m",
    "5d 8P 10m 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  h9: ["1P 7m 9M 10m 12d", "3m 7m 8P 9M 12d", "5d 8P 9M 10m 14m", "7m 10m 12d 15P 16M"],
  "-b6": ["1P 5P 6m 8P 10m", "1P 5P 8P 10m 13m", "3m 5P 8P 10m 13m", "5P 8P 10m 13m", "5P 8P 10m 13m 15P"],
  "-#5": ["1P 6m 8P 10m 13m", "3m 6m 8P 10m 13m", "6m 8P 10m 13m 15P"],
  "7b9": ["1P 3M 7m 9m 10M", "3M 7m 8P 9m 10M", "3M 7m 8P 9m 14m", "7m 9m 10M 14m 15P"],
  "7#9": ["1P 3M 7m 10m", "3M 7m 8P 10m 14m", "7m 10m 10M 14m 15P"],
  "7#11": ["1P 3M 7m 10M 12d", "3M 7m 8P 10M 12d", "7m 10M 12d 14m 15P"],
  "7b5": ["1P 3M 7m 10M 12d", "3M 7m 8P 10M 12d", "7m 10M 12d 14m 15P"],
  "7#5": ["1P 3M 7m 10M 13m", "3M 7m 8P 10M 13m", "3M 7m 8P 13m 14m", "7m 10M 13m 14m 15P"],
  "9#11": ["1P 7m 9M 10M 12d", "3M 7m 8P 9M 12d", "7m 10M 12d 15P 16M"],
  "9b5": ["1P 7m 9M 10M 12d", "3M 7m 8P 9M 12d", "7m 10M 12d 15P 16M"],
  "9#5": ["1P 7m 9M 10M 13m", "3M 7m 9M 10M 13m", "3M 7m 9M 13m 14m", "7m 10M 13m 14m 16M", "7m 10M 13m 16M 17M"],
  "7b13": ["1P 3M 7m 10M 13m", "3M 7m 8P 10M 13m", "3M 7m 8P 13m 14m", "7m 10M 13m 14m 15P"],
  "7#9#5": ["1P 3M 7m 10m 13m", "3M 7m 10m 13m 15P", "7m 10M 13m 15P 17m"],
  "7#9b5": ["1P 3M 7m 10m 12d", "3M 7m 10m 12d 15P", "7m 10M 12d 15P 17m"],
  "7#9#11": ["1P 3M 7m 10m 12d", "3M 7m 10m 12d 15P", "7m 10M 12d 15P 17m"],
  "7b9#11": ["1P 7m 9m 10M 12d", "3M 7m 8P 9m 12d", "7m 8P 10M 12d 16m"],
  "7b9b5": ["1P 7m 9m 10M 12d", "3M 7m 8P 9m 12d", "7m 8P 10M 12d 16m"],
  "7b9#5": ["1P 7m 9m 10M 13m", "3M 7m 8P 9m 13m", "7m 9m 10M 13m 15P"],
  "7b9#9": ["1P 3M 7m 9m 10m", "3M 7m 8P 9m 10m", "7m 8P 10M 16m 17m"],
  "7b9b13": ["1P 7m 9m 10M 13m", "3M 7m 8P 9m 13m", "7m 9m 10M 13m 15P"],
  "7alt": [
    "3M 7m 8P 9m 12d",
    "1P 7m 10m 10M 13m",
    "3M 7m 8P 10m 13m",
    "3M 7m 9m 12d 15P",
    "3M 7m 10m 13m 15P",
    "7m 10M 12d 15P 17m",
    "7m 10M 13m 15P 17m"
  ],
  "13#11": ["1P 6M 7m 10M 12d", "3M 7m 9M 12d 13M", "7m 10M 12d 13M 16M"],
  "13b9": ["1P 3M 6M 7m 9m", "1P 6M 7m 9m 10M", "3M 7m 9m 10M 13M", "3M 7m 10M 13M 16m", "7m 10M 13M 16m 17M"],
  "13#9": ["1P 3M 6M 7m 10m", "3M 7m 8P 10m 13M", "7m 10M 13M 14m 17m"],
  "7b9sus": ["1P 5P 7m 9m 11P", "5P 7m 8P 9m 11P", "7m 8P 11P 14m 16m"],
  "7susadd3": ["1P 4P 5P 7m 10M", "5P 8P 10M 11P 14m", "7m 11P 12P 15P 17M"],
  "9sus": ["1P 5P 7m 9M 11P", "5P 7m 8P 9M 11P", "7m 8P 9M 11P 12P", "7m 8P 11P 12P 16M"],
  "13sus": ["1P 4P 6M 7m 9M", "1P 7m 9M 11P 13M", "5P 7m 9M 11P 13M", "7m 9M 11P 13M 15P"],
  "7b13sus": ["1P 5P 7m 11P 13m", "5P 7m 8P 11P 13m", "7m 11P 13m 14m 15P"]
}, qr = {
  2: ["1P 5P 6M 8P 9M", "1P 5P 8P 9M 12P", "5P 8P 9M 12P 13M", "5P 8P 9M 12P 15P"],
  5: ["1P 5P 8P 12P", "1P 5P 8P 9M 12P", "5P 8P 12P 15P", "5P 8P 12P 15P 16M"],
  6: ["1P 5P 6M 9M 10M", "1P 5P 9M 10M 13M", "3M 5P 9M 10M 13M", "5P 8P 9M 10M 13M", "3M 6M 9M 12P 15P"],
  7: [
    "1P 5P 7m 8P 10M",
    "1P 7m 8P 10M 12P",
    "3M 7m 8P 10M 12P",
    "3M 7m 8P 10M 14m",
    "3M 7m 10M 12P 15P",
    "7m 10M 12P 14m 15P",
    "7m 10M 12P 15P 17M",
    "7m 10M 14m 17M 19P"
  ],
  9: [
    "1P 6M 7m 9M 10M",
    "3M 7m 9M 10M 12P",
    "1P 7m 9M 10M 13M",
    "3M 7m 9M 10M 13M",
    "3M 7m 9M 12P 15P",
    "7m 10M 12P 13M 16M",
    "7m 10M 13M 16M 17M",
    "7m 10M 13M 16M 19P"
  ],
  11: [
    "1P 4P 6M 7m 9M",
    "1P 5P 7m 9M 11P",
    "4P 6M 7m 9M 11P",
    "5P 8P 9M 11P 14m",
    "7m 9M 11P 13M 15P",
    "7m 11P 12P 14m 18P"
  ],
  13: [
    "3M 7m 9M 10M 13M",
    "3M 7m 9M 13M 15P",
    "3M 7m 10M 13M 16M",
    "7m 10M 12P 13M 16M",
    "7m 10M 13M 16M 17M",
    "7m 10M 13M 16M 19P"
  ],
  69: ["1P 5P 6M 9M 10M", "1P 5P 9M 10M 13M", "3M 5P 9M 10M 13M", "5P 8P 9M 10M 13M", "3M 6M 9M 12P 15P"],
  add9: [
    "1P 5P 8P 9M 10M",
    "1P 5P 9M 10M 12P",
    "3M 8P 9M 10M 12P",
    "3M 8P 9M 12P 15P",
    "5P 8P 9M 10M 15P",
    "5P 8P 9M 12P 17M"
  ],
  "+": [
    "1P 6m 8P 9M 10M",
    "1P 6m 8P 10M 13m",
    "3M 8P 9M 10M 13m",
    "3M 8P 10M 13m 15P",
    "6m 10M 13m 15P 16M",
    "6m 10M 13m 15P 17M"
  ],
  o: [
    "1P 6M 8P 10m 12d",
    "1P 6M 10m 12d 13M",
    "3m 8P 10m 12d 13M",
    "3m 8P 12d 13M 15P",
    "5d 10m 12d 13M 15P",
    "5d 10m 13M 15P 17m",
    "6M 12d 13M 15P 17m",
    "6M 12d 15P 17m 19d"
  ],
  h: [
    "1P 5d 7m 10m 11P",
    "3m 5d 7m 8P 11P",
    "5d 7m 8P 10m 11P",
    "1P 7m 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 8P 10m 11P 14m",
    "7m 10m 11P 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  sus: [
    "1P 4P 5P 8P 9M",
    "1P 4P 5P 8P 11P",
    "1P 5P 8P 9M 11P",
    "5P 8P 9M 11P 12P",
    "5P 8P 11P 12P 13M",
    "5P 8P 11P 13M 15P"
  ],
  "^": [
    "1P 3M 5P 6M 9M",
    "1P 5P 8P 10M 12P",
    "3M 5P 9M 10M 12P",
    "1P 5P 8P 10M 13M",
    "3M 8P 10M 13M 15P",
    "5P 9M 10M 12P 15P"
  ],
  "-": [
    "1P 3m 5P 8P 10m",
    "1P 3m 5P 9M 11P",
    "3m 5P 8P 9M 11P",
    "5P 8P 9M 10m 11P",
    "1P 5P 9M 10m 12P",
    "3m 5P 8P 10m 12P",
    "5P 8P 10m 12P 15P"
  ],
  "^7": [
    "1P 6M 7M 9M 10M",
    "3M 7M 9M 10M 12P",
    "1P 7M 9M 10M 13M",
    "3M 7M 9M 10M 13M",
    "3M 7M 9M 12P 13M",
    "3M 7M 9M 13M 14M",
    "3M 7M 10M 13M 16M",
    "7M 10M 13M 14M 16M",
    "7M 10M 13M 16M 17M",
    "7M 10M 13M 16M 19P"
  ],
  "-7": [
    "1P 3m 5P 7m 9M",
    "1P 3m 5P 7m 10m",
    "1P 5P 7m 10m 11P",
    "3m 7m 8P 10m 11P",
    "1P 5P 7m 10m 12P",
    "3m 7m 9M 10m 12P",
    "3m 7m 8P 10m 14m",
    "5P 7m 9M 10m 14m",
    "7m 10m 11P 14m 15P",
    "7m 10m 12P 15P 16M",
    "5P 8P 11P 14m 17m",
    "7m 10m 12P 15P 17m"
  ],
  "7sus": [
    "1P 4P 6M 7m 9M",
    "1P 5P 7m 9M 11P",
    "4P 6M 7m 9M 11P",
    "5P 8P 9M 11P 14m",
    "7m 9M 11P 13M 15P",
    "7m 11P 12P 14m 18P"
  ],
  h7: [
    "1P 5d 7m 10m 11P",
    "3m 5d 7m 8P 11P",
    "5d 7m 8P 10m 11P",
    "1P 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 8P 10m 11P 14m",
    "7m 10m 11P 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  o7: [
    "1P 6M 8P 10m 12d",
    "1P 6M 10m 12d 13M",
    "3m 8P 10m 12d 13M",
    "3m 8P 12d 13M 15P",
    "5d 10m 12d 13M 15P",
    "5d 10m 13M 15P 17m",
    "6M 12d 13M 15P 17m",
    "6M 12d 15P 17m 19d"
  ],
  "^9": [
    "1P 6M 7M 9M 10M",
    "1P 7M 9M 10M 13M",
    "3M 7M 9M 10M 13M",
    "3M 7M 9M 12P 13M",
    "3M 7M 8P 9M 13M",
    "3M 7M 9M 13M 14M",
    "3M 7M 10M 13M 16M",
    "7M 10M 13M 14M 16M",
    "7M 10M 13M 16M 17M",
    "7M 10M 13M 16M 19P"
  ],
  "^13": [
    "1P 6M 7M 9M 10M",
    "1P 7M 9M 10M 13M",
    "3M 7M 9M 12P 13M",
    "3M 7M 9M 10M 13M",
    "3M 7M 8P 9M 13M",
    "3M 7M 9M 13M 14M",
    "3M 7M 10M 13M 16M",
    "7M 10M 13M 14M 16M",
    "7M 10M 13M 16M 17M",
    "7M 10M 13M 16M 19P"
  ],
  "^7#11": [
    "1P 3M 5d 7M 9M",
    "1P 7M 9M 10M 12d",
    "3M 7M 9M 10M 12d",
    "3M 7M 9M 12d 13M",
    "3M 7M 10M 12d 14M",
    "7M 10M 12d 13M 14M",
    "7M 10M 12d 13M 16M",
    "7M 10M 12d 14M 17M"
  ],
  "^9#11": [
    "1P 3M 5d 7M 9M",
    "1P 7M 9M 10M 12d",
    "3M 7M 9M 10M 12d",
    "3M 7M 9M 12d 13M",
    "3M 7M 9M 12d 14M",
    "7M 10M 12d 14M 16M",
    "7M 10M 12d 13M 16M"
  ],
  "^7#5": ["1P 6m 7M 10M 13m", "3M 7M 9M 10M 13m", "3M 7M 10M 13m 14M", "7M 10M 13m 14M 16M", "7M 10M 13m 14M 17M"],
  "-6": [
    "1P 3m 5P 6M 9M",
    "3m 5P 6M 8P 9M",
    "1P 5P 6M 10m 11P",
    "3m 5P 6M 8P 11P",
    "1P 5P 9M 10m 13M",
    "3m 5P 8P 9M 13M",
    "5P 8P 10m 11P 13M",
    "5P 8P 10m 13M 16M"
  ],
  "-69": [
    "1P 3m 5P 6M 9M",
    "3m 5P 6M 8P 9M",
    "3m 6M 9M 10m 12P",
    "1P 5P 9M 10m 13M",
    "3m 5P 8P 9M 13M",
    "5P 8P 9M 10m 13M",
    "5P 8P 10m 13M 16M"
  ],
  "-^7": [
    "1P 3m 5P 7M 9M",
    "1P 5P 7M 10m 11P",
    "3m 7M 9M 10m 11P",
    "3m 7M 9M 10m 12P",
    "3m 7M 9M 12P 14M",
    "7M 10m 11P 12P 14M",
    "7M 10m 12P 14M 16M"
  ],
  "-^9": [
    "1P 3m 5P 7M 9M",
    "1P 5P 7M 10m 11P",
    "3m 7M 9M 10m 11P",
    "3m 7M 9M 10m 12P",
    "3m 7M 9M 12P 14M",
    "7M 10m 11P 12P 14M",
    "7M 10m 12P 14M 16M"
  ],
  "-9": [
    "1P 3m 5P 7m 9M",
    "1P 3m 7m 9M 11P",
    "3m 7m 9M 10m 11P",
    "3m 7m 9M 10m 12P",
    "3m 7m 9M 10m 14m",
    "3m 7m 9M 12P 15P",
    "7m 10m 11P 14m 16M",
    "7m 10m 12P 16M 18P"
  ],
  "-add9": ["1P 2M 3m 5P 8P", "1P 3m 5P 9M", "3m 5P 8P 9M 12P", "5P 8P 9M 10m 12P"],
  "-11": [
    "3m 5P 7m 9M 11P",
    "7m 9M 10m 11P",
    "1P 4P 7m 10m 12P",
    "3m 7m 9M 11P 12P",
    "7m 9M 10m 11P 12P",
    "3m 7m 9M 11P 14m",
    "4P 10m 12P 14m",
    "5P 8P 11P 14m",
    "5P 8P 11P 14m 16M",
    "7m 10m 12P 16M 18P",
    "7m 10m 11P 16M 21m"
  ],
  "-7b5": [
    "1P 5d 7m 10m 11P",
    "3m 5d 7m 8P 11P",
    "5d 7m 8P 10m 11P",
    "1P 7m 10m 12d",
    "3m 7m 8P 10m 12d",
    "3m 7m 8P 12d 14m",
    "5d 8P 10m 11P 14m",
    "7m 10m 11P 12d 14m",
    "7m 10m 12d 14m 15P",
    "5d 8P 10m 14m 17m"
  ],
  h9: [
    "3m 5d 7m 9M 11P",
    "1P 7m 9M 10m 12d",
    "3m 7m 9M 12d 14m",
    "5d 8P 9M 10m 14m",
    "7m 10m 11P 12d 14m",
    "7m 10m 12d 14m 16M"
  ],
  "-b6": ["1P 3m 5P 6m 8P", "3m 5P 8P 11P 13m", "5P 8P 10m 11P 13m"],
  "-#5": ["1P 6m 8P 10m 13m", "3m 6m 8P 11P 13m", "6m 8P 10m 13m 15P"],
  "7b9": ["1P 3M 7m 9m 10M", "3M 7m 8P 9m 10M", "3M 7m 8P 9m 14m", "7m 9m 10M 14m 15P"],
  "7#9": ["1P 3M 7m 10m", "3M 7m 10m 10M 12P", "3M 7m 10m 12P 14m", "7m 10M 12P 14m 17m"],
  "7#11": ["1P 3M 7m 9M 12d", "3M 7m 9M 12d 13M", "7m 10M 12d 13M 16M"],
  "7b5": ["1P 3M 7m 9M 12d", "3M 7m 9M 12d 13M", "7m 10M 12d 13M 16M"],
  "7#5": ["1P 3M 7m 10M 13m", "3M 7m 8P 10M 13m", "3M 7m 8P 13m 14m", "7m 10M 13m 14m 15P", "7m 10M 13m 14m 17M"],
  "9#11": ["1P 7m 9M 10M 12d", "3M 7m 8P 9M 12d", "7m 10M 12d 15P 16M"],
  "9b5": ["1P 7m 9M 10M 12d", "3M 7m 8P 9M 12d", "7m 10M 12d 15P 16M"],
  "9#5": ["1P 7m 9M 10M 13m", "3M 7m 9M 10M 13m", "3M 7m 9M 13m 14m", "7m 10M 13m 14m 16M", "7m 10M 13m 16M 17M"],
  "7b13": ["1P 3M 7m 10M 13m", "3M 7m 8P 10M 13m", "3M 7m 8P 13m 14m", "7m 10M 13m 14m 15P", "7m 10M 13m 14m 17M"],
  "7#9#5": ["3M 7m 10m 10M 13m", "3M 7m 10m 13m 14m", "7m 10M 13m 14m 17m"],
  "7#9b5": ["3M 7m 10m 10M 12d", "3M 7m 10m 12d 14m", "7m 10M 12d 14m 17m"],
  "7#9#11": ["3M 7m 10m 10M 12d", "3M 7m 10m 12d 14m", "7m 10M 12d 14m 17m"],
  "7b9#11": ["3M 7m 9m 10M 12d", "3M 7m 9m 12d 14m", "7m 8P 10M 12d 16m", "7m 10M 12d 14m 16m"],
  "7b9b5": ["3M 7m 9m 10M 12d", "3M 7m 9m 12d 14m", "7m 8P 10M 12d 16m", "7m 10M 12d 14m 16m"],
  "7b9#5": ["1P 7m 9m 10M 13m", "3M 7m 9m 10M 13m", "3M 7m 10M 13m 16m", "7m 10M 13m 14m 16m", "7m 10M 13m 16m 17M"],
  "7b9#9": ["1P 3M 7m 9m 10m", "3M 7m 10m 13m 16m", "7m 10M 13m 16m 17m"],
  "7b9b13": ["1P 7m 9m 10M 13m", "3M 7m 9m 10M 13m", "3M 7m 10M 13m 16m", "7m 10M 13m 14m 16m", "7m 10M 13m 16m 17M"],
  "7alt": [
    "3M 7m 8P 10m 13m",
    "3M 7m 9m 12d 13m",
    "3M 7m 9m 10m 13m",
    "3M 7m 10m 13m 14m",
    "3M 7m 9m 12d 14m",
    "3M 7m 10m 13m 15P",
    "3M 7m 10m 13m 16m",
    "7m 10M 12d 14m 16m",
    "7m 10M 12d 13m 16m",
    "7m 10M 13m 15P 17m",
    "7m 10M 13m 16m 17m",
    "7m 10M 13m 16m 19d"
  ],
  "13#11": ["3M 7m 9M 12d 13M", "7m 10M 12d 13M 16M"],
  "13b9": ["3M 7m 9m 10M 13M", "3M 7m 10M 13M 16m", "7m 10M 13M 16m 17M"],
  "13#9": ["3M 7m 10m 10M 13M", "7m 10M 13M 14m 17m"],
  "7b9sus": ["1P 5P 7m 9m 11P", "5P 7m 8P 9m 11P", "7m 8P 11P 14m 16m"],
  "7susadd3": ["1P 4P 5P 7m 10M", "5P 8P 10M 11P 14m", "7m 11P 12P 15P 17M"],
  "9sus": [
    "1P 4P 6M 7m 9M",
    "1P 5P 7m 9M 11P",
    "4P 6M 7m 9M 11P",
    "5P 8P 9M 11P 14m",
    "7m 9M 11P 13M 15P",
    "7m 11P 12P 14m 18P"
  ],
  "13sus": [
    "1P 4P 6M 7m 9M",
    "1P 7m 9M 11P 13M",
    "4P 7m 9M 11P 13M",
    "7m 9M 11P 13M 15P",
    "7m 11P 13M 14m 16M",
    "7m 11P 13M 16M 18P"
  ],
  "7b13sus": ["1P 5P 7m 11P 13m", "5P 7m 8P 11P 13m", "7m 11P 13m 14m 15P"]
}, { dictionaryVoicing: aF, minTopNoteDiff: oF } = lc.default || lc, cF = {
  m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
  7: ["3M 6M 7m 9M", "7m 9M 10M 13M"],
  "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
  69: ["3M 5P 6A 9M"],
  m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
  "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
  "7#11": ["7m 9M 11A 13A"],
  "7#9": ["3M 7m 9A"],
  mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
  m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
}, lF = {
  m7: ["3m 7m", "7m 10m"],
  m9: ["3m 7m", "7m 10m"],
  7: ["3M 7m", "7m 10M"],
  "^7": ["3M 7M", "7M 10M"],
  "^9": ["3M 7M", "7M 10M"],
  69: ["3M 6M"],
  6: ["3M 6M", "6M 10M"],
  m7b5: ["3m 7m", "7m 10m"],
  "7b9": ["3M 7m", "7m 10M"],
  "7b13": ["3M 7m", "7m 10M"],
  o7: ["3m 6M", "6M 10m"],
  "7#11": ["3M 7m", "7m 10M"],
  "7#9": ["3M 7m", "7m 10M"],
  mM7: ["3m 7M", "7M 10m"],
  m6: ["3m 6M", "6M 10m"]
}, fF = {
  "": ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
  o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
  aug: ["1P 3m 5A", "3m 5A 8P", "5A 8P 10m"]
}, hF = {
  // triads
  "": ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
  o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
  aug: ["1P 3m 5A", "3m 5A 8P", "5A 8P 10m"],
  // sevenths chords
  m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
  7: ["3M 6M 7m 9M", "7m 9M 10M 13M"],
  "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
  69: ["3M 5P 6A 9M"],
  m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
  "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
  "7#11": ["7m 9M 11A 13A"],
  "7#9": ["3M 7m 9A"],
  mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
  m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
}, Br = {
  lefthand: { dictionary: cF, range: ["F3", "A4"], mode: "below", anchor: "a4" },
  triads: { dictionary: fF, mode: "below", anchor: "a4" },
  guidetones: { dictionary: lF, mode: "above", anchor: "a4" },
  legacy: { dictionary: hF, mode: "below", anchor: "a4" }
};
let Tg = "ireal";
const Lg = (e) => Tg = e, pF = (e, t) => Rg(e, Br[e].dictionary, t), Rg = (e, t, n = ["F3", "A4"]) => {
  Object.assign(Br, { [e]: { dictionary: t, range: n } });
}, Ra = (e, t, n = {}) => {
  Object.assign(Br, { [e]: { dictionary: t, ...n } });
}, dF = (e, t, n) => {
  const { dictionary: r, range: i } = Br[t];
  return aF({
    chord: e,
    dictionary: r,
    range: i,
    picker: oF,
    lastVoicing: n
  });
};
let wi;
const mF = T("voicings", function(e, t) {
  return t.fmap((n) => (wi = dF(n, e, wi), Te(...wi))).outerJoin();
}), gF = T("rootNotes", function(e, t) {
  return t.fmap((n) => {
    const s = (n.chord || n).match(/^([a-gA-G][b#]?).*$/)[1] + e;
    return n.chord ? { note: s } : s;
  });
}), yF = T("voicing", function(e) {
  return e.fmap((t) => {
    t = typeof t == "string" ? { chord: t } : t;
    let { dictionary: n = Tg, chord: r, anchor: i, offset: s, mode: u, n: a, octaves: o, ...f } = t;
    n = typeof n == "string" ? Br[n] : { dictionary: n, mode: "below", anchor: "c5" };
    try {
      let h = Y7({ ...n, chord: r, anchor: i, offset: s, mode: u, n: a, octaves: o });
      return Te(...h).note().set(f);
    } catch {
      return Je(`[voicing]: unknown chord "${r}"`), Be;
    }
  }).outerJoin();
});
function Kr(e, t, n) {
  n = Array.isArray(n) ? n : [n], n.forEach((r) => {
    r[t] = r[e];
  });
}
Kr("^", "", [lr, qr]);
Object.keys(lr).forEach((e) => {
  if (e.includes("-")) {
    let t = e.replace("-", "m");
    Kr(e, t, [qr, lr]);
  }
  if (e.includes("^")) {
    let t = e.replace("^", "M");
    Kr(e, t, [qr, lr]);
  }
  if (e.includes("+")) {
    let t = e.replace("+", "aug");
    Kr(e, t, [qr, lr]);
  }
});
Ra("ireal", lr);
Ra("ireal-ext", qr);
function bF() {
  wi = void 0, Lg("ireal");
}
const AF = "@strudel/tonal", MF = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addVoicings: Rg,
  packageName: AF,
  registerVoicings: Ra,
  resetVoicings: bF,
  rootNotes: gF,
  scale: nF,
  scaleTranspose: tF,
  setDefaultVoicings: Lg,
  setVoicingRange: pF,
  transpose: eF,
  voicing: yF,
  voicingAlias: Kr,
  voicingRegistry: Br,
  voicings: mF
}, Symbol.toStringTag, { value: "Module" }));
async function CF() {
  const e = Bi(
    Bi,
    Promise.resolve().then(() => Wp),
    Promise.resolve().then(() => iv),
    Promise.resolve().then(() => MF),
    Promise.resolve().then(() => YC),
    { hush: PF, evaluate: DF }
  );
  await Promise.all([
    e,
    Ad()
    /* , registerSoundfonts() */
  ]);
}
let Au, Kn;
function vF(e = {}) {
  md(), e.miniAllStrings !== !1 && Gd();
  const { prebake: t, ...n } = e;
  return Kn = Bd({ ...n, transpiler: EP }), Au = (async () => (await CF(), await t?.(), Kn))(), _i(() => Kn.scheduler.now()), Au;
}
window.initStrudel = vF;
z.prototype.play = function() {
  if (!Kn)
    throw new Error(".play: no repl found. Have you called initStrudel?");
  return Au.then(() => {
    Kn.setPattern(this, !0);
  }), this;
};
function PF() {
  Kn.stop();
}
async function DF(e, t = !0) {
  return Kn.evaluate(e, t);
}
export {
  Dc as ClockCollator,
  Xp as Cyclist,
  Yu as DEFAULT_MAX_POLYPHONY,
  j as Fraction,
  $e as Hap,
  z as Pattern,
  QC as StartRules,
  pr as State,
  Jn as SyntaxError,
  He as TimeSpan,
  ju as __chooseWith,
  Ou as _brandBy,
  Lc as _fitslice,
  zu as _irand,
  qu as _keyDown,
  Rc as _match,
  St as _mod,
  Xc as _polymeterListSteps,
  tu as _retime,
  nu as _slices,
  ul as accelerate,
  zf as activeLabel,
  Y1 as ad,
  y3 as add,
  Rg as addVoicings,
  J1 as adsr,
  MC as aliasBank,
  xM as almostAlways,
  EM as almostNever,
  SM as always,
  ll as amp,
  at as analysers,
  jn as analysersData,
  Pl as analyze,
  mh as anchor,
  T3 as and,
  hb as apply,
  ki as applyFM,
  On as applyGainCurve,
  Q1 as ar,
  n3 as arrange,
  yp as as,
  hl as att,
  fl as attack,
  pc as averageArray,
  YM as backgroundImage,
  P3 as band,
  kl as bandf,
  Nl as bandq,
  vl as bank,
  vc as base64ToUnicode,
  Kl as bbexpr,
  Jl as bbst,
  _A as beat,
  Ll as begin,
  nM as binary,
  Bp as binaryN,
  o3 as bind,
  A1 as binshift,
  bb as bite,
  Mp as bjork,
  E3 as blshift,
  D3 as bor,
  Vl as bp,
  S0 as bpa,
  w0 as bpattack,
  N0 as bpd,
  V0 as bpdecay,
  P0 as bpe,
  v0 as bpenv,
  Il as bpf,
  Tl as bpq,
  q0 as bpr,
  $0 as bprelease,
  Z0 as bps,
  X0 as bpsustain,
  wb as brak,
  aM as brand,
  uM as brandBy,
  x3 as brshift,
  F3 as bxor,
  Ub as bypass,
  ql as byteBeatExpression,
  Hl as byteBeatStartTime,
  Ky as calculateSteps,
  Ic as cat,
  sp as ccn,
  up as ccv,
  Z3 as ceil,
  Ul as ch,
  h0 as channel,
  Yl as channels,
  cM as choose,
  Ip as chooseCycles,
  $u as chooseInWith,
  ji as chooseWith,
  CA as chop,
  hh as chord,
  jb as chunk,
  Kb as chunkBack,
  Hb as chunkback,
  Zi as clamp,
  UM as cleanupUi,
  _1 as clip,
  jl as coarse,
  Wy as code2hash,
  K1 as color,
  H1 as colour,
  g1 as comb,
  By as compose,
  K3 as compress,
  H3 as compressSpan,
  Nh as compressor,
  Rh as compressorAttack,
  Th as compressorKnee,
  Lh as compressorRatio,
  Gh as compressorRelease,
  J3 as compressspan,
  qi as connectToDestination,
  _y as constant,
  $c as contract,
  ip as control,
  IA as controls,
  WA as cosine,
  OA as cosine2,
  pb as cpm,
  B1 as cps,
  vp as createClock,
  Ci as createFilter,
  Oi as createParam,
  Nu as createParams,
  zl as crush,
  m0 as ctf,
  ap as ctlNum,
  Kf as ctranspose,
  me as curry,
  T1 as curve,
  p0 as cut,
  d0 as cutoff,
  Us as cycleToSeconds,
  El as dec,
  Fl as decay,
  CF as defaultPrebake,
  yM as degrade,
  gM as degradeBy,
  mM as degradeByWith,
  $f as degree,
  ff as delay,
  pf as delayfb,
  hf as delayfeedback,
  gf as delayt,
  mf as delaytime,
  L1 as deltaSlide,
  Mf as det,
  Af as detune,
  df as dfb,
  dh as dict,
  ph as dictionary,
  Vh as dist,
  Ih as distort,
  M3 as div,
  lf as djf,
  GC as dough,
  Fd as doughTrigger,
  Vd as drawFrequencyScope,
  xc as drawLine,
  Id as drawTimeScope,
  $l as drive,
  Oc as drop,
  Pf as dry,
  Kp as drywet,
  U1 as ds,
  Pd as dspWorklet,
  yf as dt,
  V1 as dur,
  I1 as duration,
  db as early,
  Gb as echo,
  Nb as echoWith,
  Tb as echowith,
  Rl as end,
  d1 as enhance,
  k3 as eq,
  I3 as eqt,
  TA as euclid,
  GA as euclidLegato,
  XA as euclidLegatoRot,
  RA as euclidRot,
  LA as euclidrot,
  Bi as evalScope,
  DF as evaluate,
  fb as every,
  jc as expand,
  jh as expression,
  zc as extend,
  Ef as fadeInTime,
  Ff as fadeOutTime,
  Df as fadeTime,
  H0 as fanchor,
  rb as fast,
  Yb as fastChunk,
  Y3 as fastGap,
  gt as fastcat,
  Jb as fastchunk,
  U3 as fastgap,
  Dl as fft,
  rA as filter,
  iA as filterWhen,
  lb as firstOf,
  EA as fit,
  An as flatten,
  X3 as floor,
  ml as fm,
  yl as fmattack,
  bl as fmdecay,
  gl as fmenv,
  pl as fmh,
  dl as fmi,
  Ml as fmrelease,
  Al as fmsustain,
  Cl as fmvelocity,
  Q3 as focus,
  eb as focusSpan,
  tb as focusspan,
  ky as fractionalArgs,
  v1 as frameRate,
  P1 as frames,
  c1 as freeze,
  xf as freq,
  vu as freqToMidi,
  O3 as fromBipolar,
  Yh as fshift,
  Uh as fshiftnote,
  Qh as fshiftphase,
  K0 as ftype,
  R3 as func,
  ol as gain,
  Qt as gainNode,
  Mr as gap,
  Xf as gat,
  Gf as gate,
  tn as getADSRValues,
  yd as getAnalyserById,
  Ki as getAnalyzerData,
  Ee as getAudioContext,
  DC as getAudioContextCurrentTime,
  ld as getAudioDevices,
  pC as getCachedBuffer,
  qp as getCompressor,
  Tu as getControlName,
  Ec as getCurrentKeyboardState,
  Ke as getDefaultValue,
  Fy as getEventOffsetMs,
  hc as getFreq,
  mc as getFrequency,
  ta as getLeafLocation,
  na as getLeafLocations,
  Rd as getLeaves,
  ea as getLfo,
  mC as getLoadedBuffer,
  Cd as getOscillator,
  en as getParamADSR,
  zy as getPerformanceTimeSeconds,
  Yr as getPitchEnvelope,
  Sy as getPlayableNoteValue,
  Jp as getSampleBuffer,
  Yp as getSampleBufferSource,
  Hp as getSampleInfo,
  Pi as getSound,
  wy as getSoundIndex,
  uu as getTime,
  Zp as getTrigger,
  Ur as getVibratoOscillator,
  kP as getWidgetID,
  Wt as getWorklet,
  vd as getZZFX,
  uA as grow,
  S3 as gt,
  _3 as gte,
  nv as h,
  Hf as harmonic,
  Oy as hash2code,
  M1 as hbrick,
  nf as hcutoff,
  _l as hold,
  D1 as hours,
  sf as hp,
  x0 as hpa,
  E0 as hpattack,
  I0 as hpd,
  k0 as hpdecay,
  C0 as hpe,
  M0 as hpenv,
  rf as hpf,
  af as hpq,
  j0 as hpr,
  z0 as hprelease,
  G0 as hps,
  R0 as hpsustain,
  uf as hresonance,
  nA as hsl,
  tA as hsla,
  ib as hurry,
  PF as hush,
  cr as id,
  p1 as imag,
  ZM as inhabit,
  OM as inhabitmod,
  dd as initAudio,
  md as initAudioOnFirstClick,
  vF as initStrudel,
  gd as initializeAudioOutput,
  c3 as innerBind,
  ab as inside,
  Fb as inv,
  Db as invert,
  Eh as ir,
  oM as irand,
  xh as iresponse,
  Un as isNote,
  Cy as isNoteWithOctave,
  wu as isPattern,
  zi as isaw,
  Gu as isaw2,
  Zb as iter,
  Wb as iterBack,
  Ob as iterback,
  qA as itri,
  KA as itri2,
  Vb as jux,
  kb as juxBy,
  Ib as juxby,
  n1 as kcutoff,
  m3 as keep,
  g3 as keepif,
  Fc as keyAlias,
  _M as keyDown,
  t1 as krush,
  jf as label,
  cb as lastOf,
  Nc as late,
  C1 as lbrick,
  k1 as legato,
  Zf as leslie,
  X1 as lfo,
  Ab as linger,
  Pu as listRange,
  Ju as loadBuffer,
  bf as lock,
  Cu as logKey,
  Gl as loop,
  DA as loopAt,
  xA as loopAtCps,
  Xl as loopBegin,
  Wl as loopEnd,
  FA as loopat,
  wA as loopatcps,
  Zl as loopb,
  Ol as loope,
  y0 as lp,
  F0 as lpa,
  D0 as lpattack,
  _0 as lpd,
  B0 as lpdecay,
  A0 as lpe,
  b0 as lpenv,
  g0 as lpf,
  cf as lpq,
  O0 as lpr,
  W0 as lprelease,
  L0 as lps,
  T0 as lpsustain,
  Wf as lrate,
  Of as lsize,
  w3 as lt,
  B3 as lte,
  tv as m,
  Fu as mapArgs,
  i3 as mask,
  xy as midi2note,
  Hn as midiToFreq,
  dp as midibend,
  ep as midichan,
  rp as midicmd,
  tp as midimap,
  np as midiport,
  mp as miditouch,
  ra as mini,
  ri as mini2ast,
  Gd as miniAllStrings,
  rv as minify,
  F1 as minutes,
  C3 as mod,
  bh as mode,
  UA as mouseX,
  JA as mouseY,
  YA as mousex,
  HA as mousey,
  qf as mtranspose,
  A3 as mul,
  il as n,
  dc as nanFallback,
  V3 as ne,
  N3 as net,
  wM as never,
  Q0 as noise,
  sl as note,
  Rn as noteToMidi,
  Mt as nothing,
  op as nrpnn,
  cp as nrpv,
  Uf as nudge,
  At as numeralArgs,
  Pc as objectMap,
  Qf as octave,
  Yf as octaveR,
  yh as octaves,
  r1 as octer,
  i1 as octersub,
  s1 as octersubsub,
  xb as off,
  gh as offset,
  DM as often,
  id as onTriggerSample,
  L3 as or,
  eh as orbit,
  l3 as outerBind,
  ob as outside,
  th as overgain,
  nh as overshape,
  Gc as pace,
  AF as packageName,
  Ac as pairs,
  _b as palindrome,
  rh as pan,
  Rf as panchor,
  EC as panic,
  ah as panorient,
  ih as panspan,
  sh as pansplay,
  uh as panwidth,
  Td as parse,
  bc as parseFractional,
  Du as parseNumeral,
  m1 as partials,
  Sf as patt,
  wf as pattack,
  Cr as patternifyAST,
  Lf as pcurve,
  _f as pdec,
  Bf as pdecay,
  Tf as penv,
  dM as perlin,
  Tp as perlinWith,
  r0 as ph,
  f0 as phasdp,
  i0 as phaser,
  a0 as phasercenter,
  c0 as phaserdepth,
  n0 as phaserrate,
  s0 as phasersweep,
  o0 as phc,
  l0 as phd,
  u0 as phs,
  Lp as pick,
  IM as pickF,
  NM as pickOut,
  GM as pickReset,
  LM as pickRestart,
  WM as pickSqueeze,
  Rp as pickmod,
  VM as pickmodF,
  TM as pickmodOut,
  XM as pickmodReset,
  RM as pickmodRestart,
  zM as pickmodSqueeze,
  yc as pipe,
  R1 as pitchJump,
  G1 as pitchJumpTime,
  nb as ply,
  e3 as pm,
  p3 as polyBind,
  gp as polyTouch,
  Wi as polymeter,
  Uy as polyrhythm,
  cl as postgain,
  v3 as pow,
  Qy as pr,
  Nf as prel,
  Vf as prelease,
  Bb as press,
  Sb as pressBy,
  td as processSampleMap,
  lp as progNum,
  If as psus,
  kf as psustain,
  Ye as pure,
  Ql as pw,
  e0 as pwrate,
  t0 as pwsweep,
  mt as rand,
  sM as rand2,
  lM as randcat,
  _p as randrun,
  z3 as range,
  $3 as range2,
  j3 as rangex,
  FM as rarely,
  oh as rate,
  q3 as ratio,
  Ph as rdim,
  h1 as real,
  SA as ref,
  T as register,
  w as registerControl,
  gC as registerSamplesPrefix,
  In as registerSound,
  Ad as registerSynthSounds,
  Ra as registerVoicings,
  IF as registerWidgetType,
  RC as registerZZFXSounds,
  K as reify,
  Bl as rel,
  Sl as release,
  Ar as removeUndefineds,
  zb as repeatCycles,
  Z1 as repeatTime,
  JM as repl,
  hd as resetDefaultValues,
  _C as resetGlobalEffects,
  PC as resetLoadedSounds,
  bF as resetVoicings,
  of as resonance,
  Tc as rev,
  Up as reverseBuffer,
  Fh as rfade,
  eA as rib,
  Qb as ribbon,
  u1 as ring,
  o1 as ringdf,
  a1 as ringf,
  Ch as rlp,
  Ah as room,
  vh as roomdim,
  Dh as roomfade,
  Mh as roomlp,
  wh as roomsize,
  gF as rootNotes,
  gc as rotate,
  G3 as round,
  _h as rsize,
  Sp as run,
  el as s,
  pA as s_add,
  cA as s_alt,
  oA as s_cat,
  yA as s_contract,
  mA as s_expand,
  gA as s_extend,
  lA as s_polymeter,
  dA as s_sub,
  fA as s_taper,
  hA as s_taperlist,
  bA as s_tour,
  AA as s_zip,
  rd as samples,
  ni as saw,
  Ru as saw2,
  nF as scale,
  tF as scaleTranspose,
  b1 as scram,
  iM as scramble,
  bp as scrub,
  E1 as seconds,
  Cb as seg,
  Mb as segment,
  lh as semitone,
  Vc as seq,
  r3 as seqPLoop,
  Bt as sequence,
  Sc as sequenceP,
  d3 as set,
  pd as setDefaultAudioContext,
  Qu as setDefaultValue,
  CC as setDefaultValues,
  Lg as setDefaultVoicings,
  bC as setGainCurve,
  zp as setLogger,
  ud as setMaxPolyphony,
  od as setMultiChannelOrbits,
  wc as setStringParser,
  _i as setTime,
  vC as setVersionDefaults,
  pF as setVoicingRange,
  kh as shape,
  Kc as shrink,
  qc as shrinklist,
  rM as shuffle,
  _t as signal,
  Be as silence,
  Pp as sine,
  Xu as sine2,
  Sh as size,
  Uc as slice,
  ch as slide,
  sb as slow,
  qb as slowChunk,
  Gn as slowcat,
  Bu as slowcatPrime,
  $b as slowchunk,
  y1 as smear,
  Gy as sol2note,
  PM as someCycles,
  vM as someCyclesBy,
  CM as sometimes,
  MM as sometimesBy,
  x1 as songPtr,
  tl as sound,
  dr as soundMap,
  nl as source,
  ub as sparsity,
  qM as speak,
  Vu as speed,
  PA as splice,
  Eu as splitAt,
  vf as spread,
  Dp as square,
  zA as square2,
  jM as squeeze,
  f3 as squeezeBind,
  Wh as squiz,
  rl as src,
  Te as stack,
  t3 as stackBy,
  kc as stackCentre,
  Bc as stackLeft,
  _c as stackRight,
  ZA as steady,
  h3 as stepBind,
  Zc as stepalt,
  dt as stepcat,
  MA as steps,
  Jf as stepsPerOctave,
  Xh as stretch,
  vA as striate,
  s3 as struct,
  Xb as stut,
  Lb as stutWith,
  Rb as stutwith,
  b3 as sub,
  Hi as superdough,
  kC as superdoughTrigger,
  u3 as superimpose,
  wl as sus,
  xl as sustain,
  $h as sustainpedal,
  Pb as swing,
  vb as swingBy,
  fp as sysex,
  pp as sysexdata,
  hp as sysexid,
  Bh as sz,
  Wc as take,
  Fp as time,
  Iu as timeCat,
  aA as timecat,
  W3 as toBipolar,
  fc as tokenizeNote,
  Hc as tour,
  EP as transpiler,
  eF as transpose,
  Kh as tremdp,
  $1 as tremolo,
  qh as tremolodepth,
  Hh as tremolorate,
  Jh as tremr,
  jA as tri,
  $A as tri2,
  e1 as triode,
  f1 as tsdelay,
  w1 as uid,
  AM as undegrade,
  bM as undegradeBy,
  Cc as unicodeToBase64,
  Xy as uniq,
  Zy as uniqsort,
  Mc as uniqsortr,
  Cf as unison,
  Zh as unit,
  U0 as v,
  S1 as val,
  Dy as valueToMidi,
  al as velocity,
  J0 as vib,
  ef as vibmod,
  Y0 as vibrato,
  tf as vmod,
  fh as voice,
  yF as voicing,
  Kr as voicingAlias,
  Br as voicingRegistry,
  mF as voicings,
  Oh as vowel,
  Md as waveformN,
  zh as waveloss,
  hM as wchoose,
  Np as wchooseCycles,
  vi as webAudioTimeout,
  Sd as webaudioOutput,
  wd as webaudioOutputTrigger,
  Bd as webaudioRepl,
  Eb as when,
  BM as whenKey,
  a3 as withValue,
  sA as within,
  pM as wrandcat,
  Qc as xfade,
  l1 as xsdelay,
  z1 as zcrush,
  j1 as zdelay,
  Jc as zip,
  xu as zipWith,
  O1 as zmod,
  W1 as znoise,
  mb as zoom,
  gb as zoomArc,
  yb as zoomarc,
  N1 as zrand,
  q1 as zzfx
};
