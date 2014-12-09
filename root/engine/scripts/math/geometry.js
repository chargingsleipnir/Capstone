
var GeomUtils = {
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
    IsConvexQuad: function(quadPtA, quadPtB, quadPtC, quadPtD) {
        /// <signature>
        ///  <summary>Returns true is quad is convex</summary>
        ///  <returns type="bool" />
        /// </signature>

        var bda = Vector3.CrossProduct(Vector3.Subtract(quadPtD, quadPtB), Vector3.Subtract(quadPtA, quadPtB));
        var bdc = Vector3.CrossProduct(Vector3.Subtract(quadPtD, quadPtB), Vector3.Subtract(quadPtC, quadPtB));

        if (Vector3.DotProduct(bda, bdc) >= 0.0)
            return 0;

        var acd = Vector3.CrossProduct(Vector3.Subtract(quadPtC, quadPtA), Vector3.Subtract(quadPtD, quadPtA));
        var acb = Vector3.CrossProduct(Vector3.Subtract(quadPtC, quadPtA), Vector3.Subtract(quadPtB, quadPtA));

        return Vector3.DotProduct(acd, acb) < 0.0;
    },
    */
    GetFromVertCoords: function(coords, shapeObj) {
        /// <signature>
        ///  <summary>Returns the object provided, sized to wrap around the vertices provided</summary>
        ///  <param name="allPosCoords" type="[]">entire list of vertex positions, as decimals, in x, y, z order</param>
        ///  <param name="shapeObj" type="Object">Can be Sphere or AABB</param>
        ///  <returns type="Object" />
        /// </signature>
        var min = new Vector3(coords[0], coords[1], coords[2]);
        var max = min.GetCopy();
        var squaredLength = min.GetMagSqr();
        for (var i = 0; i < coords.length; i += 3) {
            max.x = (coords[i] > max.x) ? coords[i] : max.x;
            min.x = (coords[i] < min.x) ? coords[i] : min.x;
            max.y = (coords[i + 1] > max.y) ? coords[i + 1] : max.y;
            min.y = (coords[i + 1] < min.y) ? coords[i + 1] : min.y;
            max.z = (coords[i + 2] > max.z) ? coords[i + 2] : max.z;
            min.z = (coords[i + 2] < min.z) ? coords[i + 2] : min.z;
        }
        var centre = new Vector3((max.x + min.x) / 2, (max.y + min.y) / 2, (max.z + min.z) / 2);

        // For Sphere
        if(shapeObj.hasOwnProperty('radius')) {
            for (var i = 0; i < coords.length; i += 3) {
                var tempLength = (new Vector3(coords[i] - centre.x, coords[i + 1] - centre.y, coords[i + 2] - centre.z)).GetMagSqr();
                squaredLength = (tempLength > squaredLength) ? tempLength : squaredLength;
            }
            shapeObj.radius = Math.sqrt(squaredLength);
        }
        // For AABB
        else if (shapeObj.hasOwnProperty('radii')) {
            shapeObj.radii.SetValues(max.x - centre.x, max.y - centre.y, max.z - centre.z);
        }

        shapeObj.pos.SetCopy(centre);
        return shapeObj;
    }
}

function BoundingShape() {
    this.isTrigger = false;
    this.isCollider = false;
}

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
        return this.pos.GetAdd(this.dir.GetScale(dist));
    }
}

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
        var magInv = 1.0 / this.norm.GetMag();
        this.norm.SetScale(magInv);
        this.dist *= magInv;
        return this;
    },
    GetNormalized: function() {
        var magInv = 1.0 / this.norm.GetMag();
        return new Plane(this.norm.GetScale(magInv), this.dist * magInv);
    },
    DistanceTo: function(point) {
        /// <signature>
        ///  <summary>Get the shortest distance from the point to the plane. Sign is relative to norm direction</summary>
        ///  <param name="point" type="Vector3"></param>
        ///  <returns type="decimal" />
        /// </signature>
        return this.norm.GetDot(point) + this.dist;
    }
}

function Sphere(pos, radius, scale) {
    /// <signature>
    ///  <summary>Defined by position and radius</summary>
    ///  <param name="position" type="Vector3"></param>
    ///  <param name="radius" type="decimal"></param>
    ///  <param name="scale" type="decimal">Kept distinct from radius to maintain baseline radius</param>
    ///  <returns type="Sphere" />
    /// </signature>
    /// <signature>
    ///  <summary>Defined by position and radius, which constructs at 0.5</summary>
    ///  <returns type="Sphere" />
    /// </signature>
    this.pos = new Vector3();
    this.pos.SetCopy(pos || this.pos);
    this.radius = radius || 0.5;
    this.scale = scale || 1.0;
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
        this.scale = sphere.scale;
        return this;
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Get copy of this</summary>
        ///  <returns type="Sphere" />
        /// </signature>
        return new Sphere(this.pos, this.radius, this.scale);
    },
    SetValues: function(pos, radius, scale) {
        /// <signature>
        ///  <summary>Set with given values</summary>
        ///  <param name="position" type="Vector3"></param>
        ///  <param name="radius" type="decimal"></param>
        ///  <param name="scale" type="decimal">Kept distinct from radius to maintain baseline radius</param>
        ///  <returns type="Sphere" />
        /// </signature>
        this.pos = pos.GetCopy();
        this.radius = radius;
        this.scale = scale;
        return this;
    },
    SetScale: function(scale) {
        this.scale = scale;
    },
    GetScaledRadius: function() {
        return this.radius * this.scale;
    },
    IntersectsSphere: function(sphere) {
        var dist = (sphere.pos.GetSubtract(this.pos)).GetMagSqr();
        return dist <= Math.pow(this.radius + sphere.radius, 2);
    }
}

function AABB(pos, radii, scale) {
    /// <signature>
    ///  <summary>Defined by position, radii, and scale</summary>
    ///  <param name="position" type="Vector3"></param>
    ///  <param name="radii" type="Vector3"></param>
    ///  <param name="scale" type="Vector3">Kept distinct from radii to maintain dimensions</param>
    ///  <returns type="AABB" />
    /// </signature>
    /// <signature>
    ///  <summary>Defined by position and radii, which constructs at 0.5 each</summary>
    ///  <returns type="AABB" />
    /// </signature>
    this.pos = pos.GetCopy() || new Vector3();
    this.radii = radii.GetCopy() || new Vector3(0.5, 0.5, 0.5);
    this.scale = scale.GetCopy() || new Vector3(1.0, 1.0, 1.0);
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
        this.scale.SetCopy(box.scale);
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Create new copy of this</summary>
        ///  <returns type="AABB" />
        /// </signature>
        return new AABB(this.pos, this.radii, this.scale);
    },
    SetValues: function(pos, radii, scale) {
        /// <signature>
        ///  <summary>Defined by position, radii, and scale</summary>
        ///  <param name="position" type="Vector3"></param>
        ///  <param name="radii" type="Vector3"></param>
        ///  <param name="scale" type="Vector3">Kept distinct from radii to maintain dimensions</param>
        ///  <returns type="AABB" />
        /// </signature>
        this.pos.SetCopy(pos);
        this.radii.SetCopy(radii);
        this.scale.SetCopy(scale);
    },
    SetScale: function(scale) {
        /// <signature>
        ///  <summary>Modify scale value</summary>
        ///  <param name="scale" type="Vector3"></param>
        ///  <returns type="AABB" />
        /// </signature>
        this.scale.SetCopy(scale);
        return this;
    },
    GetScaledRadii: function() {
        /// <signature>
        ///  <summary>Get radii components times scale factors</summary>
        ///  <returns type="Vector3" />
        /// </signature>
        return this.radii.GetScaleByVec3(this.scale);
    },
    GetMinCorner: function() {
        /// <signature>
        ///  <summary>Get the vector representing the lowest valued corner</summary>
        ///  <returns type="Vector3" />
        /// </signature>
        return this.pos.GetSubtract(this.GetScaledRadii());
    },
    GetMaxCorner: function() {
        /// <signature>
        ///  <summary>Get the vector representing the highest valued corner</summary>
        ///  <returns type="Vector3" />
        /// </signature>
        return this.pos.GetAdd(this.GetScaledRadii());
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
        var radiiSqr = box.GetScaledRadii().GetDot(box.GetScaledRadii()); // Use Dot to get squared components
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
}