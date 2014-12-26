
function AAShapeData3D(centre, min, max, radii, radius) {
    this.centre = new Vector3();
    this.min = new Vector3();
    this.max = new Vector3();
    this.radii = new Vector3(1.0, 1.0, 1.0);
    this.radius = radius ? radius : 1.0;

    this.centre.SetCopy(centre || this.centre);
    this.min.SetCopy(min || this.min);
    this.max.SetCopy(max || this.max);
    this.radii.SetCopy(radii || this.radii);
}
AAShapeData3D.prototype = {
  // Provide something for rotation, to reset centre, min, and max
    RecalculateExtents: function() {
        this.min.SetCopy(this.centre.GetSubtract(this.radii));
        this.max.SetCopy(this.centre.GetAdd(this.radii));
    },
    RecalculateDimensions: function() {
        this.centre.SetValues((this.max.x + this.min.x) / 2, (this.max.y + this.min.y) / 2, (this.max.z + this.min.z) / 2);
        this.radii.SetValues(this.max.x - this.centre.x, this.max.y - this.centre.y, this.max.z - this.centre.z);
        this.radius = Math.sqrt(Math.pow(this.radii.x, 2), Math.pow(this.radii.y, 2), Math.pow(this.radii.z, 2));
    }
};

function Ray(position, direction) {
    /// <signature>
    ///  <summary>Defined by position and direction</summary>
    ///  <param name="position" type="Vector3"></param>
    ///  <param name="direction" type="Vector3"></param>
    ///  <returns type="Ray" />
    /// </signature>
    /// <signature>
    ///  <summary>Defined by position and direction</summary>
    ///  <returns type="Ray" />
    /// </signature>
    this.pos = (new Vector3()).SetCopy(position) || new Vector3();
    this.dir = (new Vector3()).SetCopy(direction) || new Vector3();
}
Ray.prototype = {
    SetCopy: function(ray) {
        /// <signature>
        ///  <summary>Set as copy of passed Ray</summary>
        ///  <returns type="Ray" />
        /// </signature>
        this.pos.SetCopy(ray.pos);
        this.dir.SetCopy(ray.dir);
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Send this out as new Ray</summary>
        ///  <returns type="Ray" />
        /// </signature>
        return new Ray(this.pos, this.dir);
    },
    SetValues: function(pos, dir) {
        /// <signature>
        ///  <summary>Set as copy of passed parameters</summary>
        ///  <param name="position" type="Vector3"></param>
        ///  <param name="direction" type="Vector3"></param>
        ///  <returns type="Ray" />
        /// </signature>
        this.pos.SetCopy(pos);
        this.dir.SetCopy(dir);
        return this;
    },
    SetNormalized: function() {
        this.dir.SetNormalized();
        return this;
    },
    GetPointAt: function(dist) {
        /// <signature>
        ///  <summary>Get the Vector3 point at the given distance on the ray</summary>
        ///  <param name="distance" type="decimal"></param>
        ///  <returns type="Vector3" />
        /// </signature>
        return this.pos.GetAdd(this.dir.GetScaleByNum(dist));
    }
};

function Plane(norm, dist) {
    /// <signature>
    ///  <summary>Define normalized direction and distance from origin</summary>
    ///  <param name="normal" type="Vector3"></param>
    ///  <param name="distance" type="decimal"></param>
    ///  <returns type="Plane" />
    /// </signature>
    /// <signature>
    ///  <summary>Defined by normalized direction and distance from origin. Constructs as x,z plane.</summary>
    ///  <returns type="Plane" />
    /// </signature>
    this.norm = new Vector3();
    this.norm.SetCopy(norm || this.norm);
    this.dist = dist || 0.0;
}
Plane.prototype = {
    SetFromPoints: function(pt1, pt2, pt3) {
        /// <signature>
        ///  <summary>Make a plane from any 3 points</summary>
        ///  <param name="point1" type="Vector3"></param>
        ///  <param name="point2" type="Vector3"></param>
        ///  <param name="point3" type="Vector3"></param>
        ///  <returns type="Plane" />
        /// </signature>
        var v1 = pt2.GetSubtract(pt1);
        var v2 = pt3.GetSubtract(pt1);
        this.norm = v1.GetCross(v2);
        this.norm.SetNormalized();
        this.dist = -((this.norm.x * pt1.x) + (this.norm.y * pt1.y) + (this.norm.z * pt1.z));
        return this;
    },
    SetCopy: function(plane) {
        /// <signature>
        ///  <summary>Set to copy of passed Ray</summary>
        ///  <param name="copy" type="Plane"></param>
        ///  <returns type="Plane" />
        /// </signature>
        this.norm.SetCopy(plane.norm);
        this.dist = plane.dist;
        return this;
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Get a copy of passed Ray</summary>
        ///  <returns type="Plane" />
        /// </signature>
        return new Plane(this.norm, this.dist);
    },
    SetValues: function(norm, dist) {
        /// <signature>
        ///  <summary>Define normalized direction and distance from origin</summary>
        ///  <param name="normal" type="Vector3"></param>
        ///  <param name="distance" type="decimal"></param>
        ///  <returns type="Plane" />
        /// </signature>
        this.norm.SetCopy(norm);
        this.dist = dist;
    },
    SetNormalized: function() {
        var magInv = this.norm.GetMagInv();
        this.norm.SetScaleByNum(magInv);
        this.dist *= magInv;
        return this;
    },
    GetNormalized: function() {
        var magInv = this.norm.GetMagInv();
        return new Plane(this.norm.GetScaleByNum(magInv), this.dist * magInv);
    },
    DistanceTo: function(point) {
        /// <signature>
        ///  <summary>Get the shortest distance from the point to the plane. Sign is relative to norm direction</summary>
        ///  <param name="point" type="Vector3"></param>
        ///  <returns type="decimal" />
        /// </signature>
        return this.norm.GetDot(point) + this.dist;
    }
};

function Tri() {
    /*
    TriangleArea: function(x1, y1, x2, y2, x3, y3) {
    return (x1 - x2) * (y2 - y3) - (x2 - x3) * (y1 - y2);
    },
    GetBarycenter: function(triPtA, triPtB, triPtC, ptP) {
    /// <signature>
    ///  <summary>Returns Vector3 with u, v, w barycentric coordinates</summary>
    ///  <param name="triPtA" type="Vector3">Represents the barycentric origin</param>
    ///  <param name="triPtB" type="Vector3">Another triangle corner</param>
    ///  <param name="triPtC" type="Vector3">Another triangle corner</param>
    ///  <param name="ptP" type="Vector3">The point to get the coordinates from, relative to the triangle</param>
    ///  <returns type="Vector3" />
    /// </signature>
    var out = [0.0, 0.0, 0.0];

    var vecAB = Vector3.Subtract(triPtB, triPtA);
    var vecAC = Vector3.Subtract(triPtC, triPtA);
    var vecAP = Vector3.Subtract(ptP, triPtA);

    var d00 = Vector3.DotProduct(vecAB, vecAB);
    var d01 = Vector3.DotProduct(vecAB, vecAC);
    var d11 = Vector3.DotProduct(vecAC, vecAC);
    var d20 = Vector3.DotProduct(vecAP, vecAB);
    var d21 = Vector3.DotProduct(vecAP, vecAC);

    var denominator = (d00 * d11) - (d01 * d01);

    out[0] = ((d11 * d20) - (d01 * d21)) / denominator;
    out[1] = ((d00 * d21) - (d01 * d20)) / denominator;
    out[2] = 1.0 - out[0] - out[1];

    return out;
    },
    GetBarycenter2: function(triPtA, triPtB, triPtC, ptP) {
    /// <signature>
    ///  <summary>Returns Vector3 with u, v, w barycentric coordinates</summary>
    ///  <param name="triPtA" type="Vector3">Represents the barycentric origin</param>
    ///  <param name="triPtB" type="Vector3">Another triangle corner</param>
    ///  <param name="triPtC" type="Vector3">Another triangle corner</param>
    ///  <param name="ptP" type="Vector3">The point to get the coordinates from, relative to the triangle</param>
    ///  <returns type="Vector3" />
    /// </signature>
    var out = [0.0, 0.0, 0.0];

    // unnormalized triangle normal
    var m = Vector3.CrossProduct(Vector3.Subtract(triPtB, triPtA), Vector3.Subtract(triPtC, triPtA));
    // numerators and one-over-denominator for u and v ratios
    var numeU, numeV, oneOverDenom;
    // Absolute components for determining projection plane
    var x = Math.abs(m[0]),
    y = Math.abs(m[1]),
    z = Math.abs(m[2]);

    // Compute areas in plane of largest projection
    if (x >= y && x >= z) {
    // x is largest, project in yz plane
    numeU = Geometry.TriangleArea(ptP[1], ptP[2], triPtB[1], triPtB[2], triPtC[1], triPtC[2]);
    numeV = Geometry.TriangleArea(ptP[1], ptP[2], triPtC[1], triPtC[2], triPtA[1], triPtA[2]);
    oneOverDenom = 1.0 / m[0];
    }
    else if (y >= x && y >= z) {
    // y is largest, project in xz plane
    numeU = Geometry.TriangleArea(ptP[0], ptP[2], triPtB[0], triPtB[2], triPtC[0], triPtC[2]);
    numeV = Geometry.TriangleArea(ptP[0], ptP[2], triPtC[0], triPtC[2], triPtA[0], triPtA[2]);
    oneOverDenom = 1.0 / -m[1];
    }
    else {
    // z is largest, project in xy plane
    numeU = Geometry.TriangleArea(ptP[0], ptP[1], triPtB[0], triPtB[1], triPtC[0], triPtC[1]);
    numeV = Geometry.TriangleArea(ptP[0], ptP[1], triPtC[0], triPtC[1], triPtA[0], triPtA[1]);
    oneOverDenom = 1.0 / m[2];
    }
    out[0] = numeU * oneOverDenom;
    out[1] = numeV * oneOverDenom;
    out[2] = 1.0 - out[0] - out[1];
    return out;
    },
    TestPointInTriangle: function(triPtA, triPtB, triPtC, ptP) {
    /// <signature>
    ///  <summary>Returns true if point is inside triangle</summary>
    ///  <param name="triPtA" type="Vector3">Represents the barycentric origin</param>
    ///  <param name="triPtB" type="Vector3">Another triangle corner</param>
    ///  <param name="triPtC" type="Vector3">Another triangle corner</param>
    ///  <param name="ptP" type="Vector3">The point to get the coordinates from, relative to the triangle</param>
    ///  <returns type="bool" />
    /// </signature>
    var baryCoords = Geometry.GetBarycenter2(triPtA, triPtB, triPtC, ptP);
    return baryCoords[1] >= 0.0 && baryCoords[2] >= 0.0 && (baryCoords[1] + baryCoords[2]) <= 1.0;
    },
    */
}

function Rect(posX, posY, radialWidth, radialHeight) {
    /// <signature>
    ///  <summary>Defined by position and radii</summary>
    ///  <param name="posX" type="decimal"></param>
    ///  <param name="posY" type="decimal"></param>
    ///  <param name="radialWidth" type="decimal"></param>
    ///  <param name="radialHeight" type="decimal"></param>
    ///  <returns type="Rect" />
    /// </signature>
    this.pos = new Vector2(posX || 0.0, posY || 0.0);
    this.radii = new Vector2(radialWidth || 1.0, radialHeight || 1.0);
}
Rect.prototype = {
    SetCopy: function(rect) {
        /// <signature>
        ///  <summary>Create new copy</summary>
        ///  <param name="rect" type="Rect"></param>
        ///  <returns type="Rect" />
        /// </signature>
        this.pos.SetCopy(rect.pos);
        this.radii.SetCopy(rect.radii);
        return this;
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Create new copy of this</summary>
        ///  <returns type="Rect" />
        /// </signature>
        return new Rect(this.pos.x, this.pos.y, this.radii.x, this.radii.y);
    },
    SetValues: function(posX, posY, radialWidth, radialHeight) {
        /// <signature>
        ///  <summary>Defined by position and radii</summary>
        ///  <param name="posX" type="decimal"></param>
        ///  <param name="posY" type="decimal"></param>
        ///  <param name="radialWidth" type="decimal"></param>
        ///  <param name="radialHeight" type="decimal"></param>
        ///  <returns type="Rect" />
        /// </signature>
        this.pos.SetValues(posX, posY);
        this.radii.SetValues(radialWidth, radialHeight);
    },
    Scale: function(scalar) {
        /// <signature>
        ///  <summary>Modify scale value</summary>
        ///  <param name="scalar" type="Vector2"></param>
        ///  <returns type="void" />
        /// </signature>
        this.radii.SetScaleByVec(scalar);
    },
    GetScaled: function(scalar) {
        /// <signature>
        ///  <summary>Get radii components times scale factors</summary>
        ///  <param name="scalar" type="Vector2"></param>
        ///  <returns type="Vector3" />
        /// </signature>
        return this.radii.GetScaleByVec(scalar);
    },
    GetMinCorner: function() {
        /// <signature>
        ///  <summary>Get the vector representing the lowest valued corner</summary>
        ///  <returns type="Vector2" />
        /// </signature>
        return this.pos.GetSubtract(this.radii);
    },
    GetMaxCorner: function() {
        /// <signature>
        ///  <summary>Get the vector representing the highest valued corner</summary>
        ///  <returns type="Vector2" />
        /// </signature>
        return this.pos.GetAdd(this.radii);
    },
    GetCornerFurthestAlong: function(norm) {
        /// <signature>
        ///  <summary>Return the Rect values most in the direction given</summary>
        ///  <param name="norm" type="Vector2"></param>
        ///  <returns type="Vector2" />
        /// </signature>
        return new Vector2(
            (norm.x > 0) ? this.GetMaxCorner().x : this.GetMinCorner().x,
            (norm.y > 0) ? this.GetMaxCorner().y : this.GetMinCorner().y
        );
    },
    GetCornerLeastAlong: function(norm) {
        /// <signature>
        ///  <summary>Return the Rect values least in the direction given</summary>
        ///  <param name="norm" type="Vector2"></param>
        ///  <returns type="Vector2" />
        /// </signature>
        return Vector2(
            (norm.x < 0) ? this.GetMaxCorner().x : this.GetMinCorner().x,
            (norm.y < 0) ? this.GetMaxCorner().y : this.GetMinCorner().y
        );
    }
};
function WndRect(x, y, w, h) {
    /// <signature>
    ///  <summary>Defined by x, y, positions and w, h, dimensions</summary>
    ///  <param name="x" type="decimal"></param>
    ///  <param name="y" type="decimal"></param>
    ///  <param name="w" type="decimal"></param>
    ///  <param name="h" type="decimal"></param>
    ///  <returns type="WndRect" />
    /// </signature>
    this.x = x || 0.0;
    this.y = y || 0.0;
    this.w = w || 0.0;
    this.h = h || 0.0;
}
WndRect.prototype = {
    SetCopy: function(wndRect) {
        /// <signature>
        ///  <summary>Create new copy</summary>
        ///  <param name="wndRect" type="WndRect"></param>
        ///  <returns type="WndRect" />
        /// </signature>
        this.x = wndRect.x;
        this.y = wndRect.y;
        this.w = wndRect.w;
        this.h = wndRect.h;
        return this;
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Create new copy of this</summary>
        ///  <returns type="WndRect" />
        /// </signature>
        return new WndRect(this.x, this.y, this.w, this.h);
    },
    SetValues: function(x, y, w, h) {
        /// <signature>
        ///  <summary>Defined by x, y, positions and w, h, dimensions</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <param name="y" type="decimal"></param>
        ///  <param name="w" type="decimal"></param>
        ///  <param name="h" type="decimal"></param>
        ///  <returns type="WndRect" />
        /// </signature>
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        return this;
    },
    Scale: function(scaleW, scaleH) {
        /// <signature>
        ///  <summary>Modify width and height values</summary>
        ///  <param name="scaleW" type="decimal"></param>
        ///  <param name="scaleH" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.w *= scaleW;
        this.h *= scaleH;
    },
    GetScaled: function(scaleW, scaleH) {
        /// <signature>
        ///  <summary>Get radii components times scale factors</summary>
        ///  <param name="scaleW" type="decimal"></param>
        ///  <param name="scaleH" type="decimal"></param>
        ///  <returns type="Vector3" />
        /// </signature>
        return new WndRect(this.x, this.y, this.w * scaleW, this.h * scaleH);
    },
    GetCentre: function() {
        /// <signature>
        ///  <summary>Get the centre point of this rect</summary>
        ///  <returns type="Vector2" />
        /// </signature>
        return new Vector2((this.x + this.w) / 2, (this.y + this.h) / 2);
    },
    GetRadii: function() {
        /// <signature>
        ///  <summary>Get the radii this rect</summary>
        ///  <returns type="Vector2" />
        /// </signature>
        return new Vector2(this.w / 2, this.h / 2);
    },
    GetMaxCorner: function() {
        /// <signature>
        ///  <summary>Get the vector representing the highest valued corner</summary>
        ///  <returns type="Vector2" />
        /// </signature>
        return new Vector2(this.x + this.w, this.y + this.h);
    }
};

function Sphere(pos, radius) {
    /// <signature>
    ///  <summary>Defined by position and radius</summary>
    ///  <param name="position" type="Vector3"></param>
    ///  <param name="radius" type="decimal"></param>
    ///  <returns type="Sphere" />
    /// </signature>
    /// <signature>
    ///  <summary>Defined by position and radius, which constructs at 0.5</summary>
    ///  <returns type="Sphere" />
    /// </signature>
    this.pos = new Vector3();
    this.pos.SetCopy(pos || this.pos);
    this.radius = radius || 1.0;
}
Sphere.prototype = {
    SetCopy: function(sphere) {
        /// <signature>
        ///  <summary>Set as exact duplicate</summary>
        ///  <param name="sphere" type="Sphere"></param>
        ///  <returns type="Sphere" />
        /// </signature>
        this.pos = sphere.pos.GetCopy();
        this.radius = sphere.radius;
        return this;
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Get copy of this</summary>
        ///  <returns type="Sphere" />
        /// </signature>
        return new Sphere(this.pos, this.radius);
    },
    SetValues: function(pos, radius) {
        /// <signature>
        ///  <summary>Set with given values</summary>
        ///  <param name="position" type="Vector3"></param>
        ///  <param name="radius" type="decimal"></param>
        ///  <returns type="Sphere" />
        /// </signature>
        this.pos = pos.GetCopy();
        this.radius = radius;
        return this;
    },
    Scale: function(scalar) {
        this.radius *= scalar;
    },
    GetScaled: function(scalar) {
        return this.radius * scalar;
    },
    IntersectsSphere: function(sphere) {
        var collisionDist = this.pos.GetSubtract(sphere.pos);
        if(collisionDist.GetMagSqr() < Math.pow(this.radius, 2) + Math.pow(sphere.radius, 2))
            return collisionDist;
        return false;
    }
};

function AABB(pos, radii) {
    /// <signature>
    ///  <summary>Defined by position, radii, and scale</summary>
    ///  <param name="position" type="Vector3"></param>
    ///  <param name="radii" type="Vector3"></param>
    ///  <returns type="AABB" />
    /// </signature>
    /// <signature>
    ///  <summary>Defined by position and radii, which constructs at 0.5 each</summary>
    ///  <returns type="AABB" />
    /// </signature>
    this.pos = new Vector3();
    this.radii = new Vector3(1.0, 1.0, 1.0);

    if(pos)
        this.pos.SetCopy(pos);
    if(radii)
        this.radii.SetCopy(radii);
}
AABB.prototype = {
    SetCopy: function(box) {
        /// <signature>
        ///  <summary>Create new copy</summary>
        ///  <param name="box" type="AABB"></param>
        ///  <returns type="AABB" />
        /// </signature>
        this.pos.SetCopy(box.pos);
        this.radii.SetCopy(box.radii);
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Create new copy of this</summary>
        ///  <returns type="AABB" />
        /// </signature>
        return new AABB(this.pos, this.radii);
    },
    SetValues: function(pos, radii) {
        /// <signature>
        ///  <summary>Defined by position, radii, and scale</summary>
        ///  <param name="position" type="Vector3"></param>
        ///  <param name="radii" type="Vector3"></param>
        ///  <returns type="AABB" />
        /// </signature>
        this.pos.SetCopy(pos);
        this.radii.SetCopy(radii);
    },
    Scale: function(scalar) {
        /// <signature>
        ///  <summary>Modify scale value</summary>
        ///  <param name="scalar" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.radii.SetScaleByVec(scalar);
    },
    GetScaled: function(scalar) {
        /// <signature>
        ///  <summary>Get radii components times scale factors</summary>
        ///  <param name="scalar" type="Vector3"></param>
        ///  <returns type="Vector3" />
        /// </signature>
        return this.radii.GetScaleByVec(scalar);
    },
    GetMinCorner: function() {
        /// <signature>
        ///  <summary>Get the vector representing the lowest valued corner</summary>
        ///  <returns type="Vector3" />
        /// </signature>
        return this.pos.GetSubtract(this.radii);
    },
    GetMaxCorner: function() {
        /// <signature>
        ///  <summary>Get the vector representing the highest valued corner</summary>
        ///  <returns type="Vector3" />
        /// </signature>
        return this.pos.GetAdd(this.radii);
    },
    GetCornerFurthestAlong: function(norm) {
        /// <signature>
        ///  <summary>Return the AABB values most in the direction given</summary>
        ///  <param name="norm" type="Vector3"></param>
        ///  <returns type="AABB" />
        /// </signature>
        return new Vector3(
            (norm.x > 0) ? this.GetMaxCorner().x : this.GetMinCorner().x,
			(norm.y > 0) ? this.GetMaxCorner().y : this.GetMinCorner().y,
			(norm.z > 0) ? this.GetMaxCorner().z : this.GetMinCorner().z
        );
    },
    GetCornerLeastAlong: function(norm) {
        /// <signature>
        ///  <summary>Return the AABB values least in the direction given</summary>
        ///  <param name="norm" type="Vector3"></param>
        ///  <returns type="AABB" />
        /// </signature>
        return Vector3(
			(norm.x < 0) ? this.GetMaxCorner().x : this.GetMinCorner().x,
			(norm.y < 0) ? this.GetMaxCorner().y : this.GetMinCorner().y,
			(norm.z < 0) ? this.GetMaxCorner().z : this.GetMinCorner().z
		);
    },
    IntersectsSphere: function(sphere) {
        /// <signature>
        ///  <summary>Returns false if there is no collision, otherwise returns a Vector3 with the depth of collision into each dimension</summary>
        ///  <param name="sphere" type="Sphere"></param>
        ///  <returns type="false or Vector3" />
        /// </signature>
        var radiusSqr = sphere.radius * sphere.radius;
        var out = new Vector3(0.0, 0.0, 0.0);
        var min = this.GetMinCorner();
        var max = this.GetMaxCorner();

        if (sphere.pos.x < min.x) {
            out.x = sphere.pos.x - min.x;
            radiusSqr -= out.x * out.x;
        }
        else if (sphere.pos.x > max.x) {
            out.x = sphere.pos.x - max.x;
            radiusSqr -= out.x * out.x;
        }
        if (sphere.pos.y < min.y) {
            out.y = sphere.pos.y - min.y;
            radiusSqr -= out.y * out.y;
        }
        else if (sphere.pos.y > max.y) {
            out.y = sphere.pos.y - max.y;
            radiusSqr -= out.y * out.y;
        }
        if (sphere.pos.z < min.z) {
            out.z = sphere.pos.z - min.z;
            radiusSqr -= out.z * out.z;
        }
        else if (sphere.pos.z > max.z) {
            out.z = sphere.pos.z - max.z;
            radiusSqr -= out.z * out.z;
        }

        if(radiusSqr > 0)
            return out;

        return false;
    },
    IntersectsAABB: function(box) {
        /// <signature>
        ///  <summary>Returns false if there is no collision, otherwise returns a Vector3 with the depth of collision into each dimension</summary>
        ///  <param name="box" type="AABB"></param>
        ///  <returns type="false or Vector3" />
        /// </signature>
        var radiiSqr = box.radii.GetDot(box.radii); // Use Dot to get squared components
        var out = new Vector3(0.0, 0.0, 0.0);
        var min = this.GetMinCorner();
        var max = this.GetMaxCorner();

        if (box.pos.x < min.x) {
            out.x = box.pos.x - min.x;
            radiiSqr -= out.x * out.x;
        }
        else if (box.pos.x > max.x) {
            out.x = box.pos.x - max.x;
            radiiSqr -= out.x * out.x;
        }
        if (box.pos.y < min.y) {
            out.y = box.pos.y - min.y;
            radiiSqr -= out.y * out.y;
        }
        else if (box.pos.y > max.y) {
            out.y = box.pos.y - max.y;
            radiiSqr -= out.y * out.y;
        }
        if (box.pos.z < min.z) {
            out.z = box.pos.z - min.z;
            radiiSqr -= out.z * out.z;
        }
        else if (box.pos.z > max.z) {
            out.z = box.pos.z - max.z;
            radiiSqr -= out.z * out.z;
        }

        if(radiiSqr > 0)
            return out;

        return false;
    }
};