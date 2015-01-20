
function Quaternion(x, y, z, w) {
    /// <signature>
    ///  <summary>Container for rotation axis and angle</summary>
    ///  <param name="x" type="decimal"></param>
    ///  <param name="y" type="decimal"></param>
    ///  <param name="z" type="decimal"></param>
    ///  <param name="w" type="decimal"></param>
    ///  <returns type="Quaternion" />
    /// </signature>
    /// <signature>
    ///  <summary>Container for rotation axis and angle</summary>
    ///  <returns type="Quaternion" />
    /// </signature>
    this.v = new Vector3(x || 0.0, y || 0.0, z || 0.0);
    this.w = w || 1.0;
}
Quaternion.prototype = {
    SetCopy: function(quat) {
        /// <signature>
        ///  <summary>Set this to copy of passed quaternion</summary>
        ///  <param name="quat" type="Quaternion"></param>
        ///  <returns type="Quaternion" />
        /// </signature>
        this.v.SetCopy(quat.v);
        this.w = quat.w;
        return this;
    },
    GetCopy: function() {
        /// <signature>
        ///  <summary>Get a copy of this</summary>
        ///  <param name="quat" type="Quaternion"></param>
        ///  <returns type="Quaternion" />
        /// </signature>
        return new Quaternion(this.v.x, this.v.y, this.v.z, this.w);
    },
    SetValues: function(x, y, z, w) {
        /// <signature>
        ///  <summary>Set values directly - not axis and angle!</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <param name="y" type="decimal"></param>
        ///  <param name="z" type="decimal"></param>
        ///  <param name="w" type="decimal"></param>
        ///  <returns type="Quaternion" />
        /// </signature>
        this.v.SetValues(x, y, z);
        this.w = w;
    },
    SetEuler: function(pitch, yaw, roll) {
        /// <signature>
        ///  <summary>Container for rotation axis and angle, from Euler angles</summary>
        ///  <param name="pitch" type="decimal">in degrees</param>
        ///  <param name="yaw" type="decimal">in degrees</param>
        ///  <param name="roll" type="decimal">in degrees</param>
        ///  <returns type="Quaternion" />
        /// </signature>
        var p = pitch * DEG_TO_RAD,
            y = yaw * DEG_TO_RAD,
            r = roll * DEG_TO_RAD;
        var sinP = Math.sin(p),
            sinY = Math.sin(y),
            sinR = Math.sin(r),
            cosP = Math.cos(p),
            cosY = Math.cos(y),
            cosR = Math.cos(r);

        /* This is the one I first studied, but seems a little effed
		this.w = sinP * sinY * sinR + cosP * cosY * cosR;
		this.v.Set(
			sinR * cosP * cosY - sinP * sinY * cosR,
			sinP * cosY * cosR + sinY * sinR * cosP,
			sinY * cosR * cosP - sinR * sinP * cosY
        ); */

        // This is still effed
        this.w = (sinP * sinY * sinR + cosP * cosY * cosR) / 2.0;
        this.v.SetValues(
            sinP * cosY * cosR + sinY * sinR * cosP,
			sinY * cosR * cosP - sinR * sinP * cosY,
			sinR * cosP * cosY - sinP * sinY * cosR
        );

        return this;
    },
    SetFromAxisAngle: function(vec3, thetaDeg) {
        /// <signature>
        ///  <summary>Container for rotation axis and angle</summary>
        ///  <param name="axis" type="Vector3"></param>
        ///  <param name="thetaDeg" type="decimal"></param>
        ///  <returns type="Quaternion" />
        /// </signature>
        var angle = thetaDeg * DEG_TO_RAD;
        var axis = vec3.GetCopy();
        if (axis.GetDot(axis) > INFINITESIMAL)
            axis.SetNormalized();

        this.w = Math.cos(angle * 0.5);
        this.v = axis.GetScaleByNum(Math.sin(angle * 0.5));

        return this;
    },
    UpdateAxisAngle: function(axis, thetaDeg) {
        /// <signature>
        ///  <summary>Update for rotation axis and angle. Saves processing if confident with axis param</summary>
        ///  <param name="axis" type="Vector3"></param>
        ///  <param name="thetaDeg" type="decimal"></param>
        ///  <returns type="Quaternion" />
        /// </signature>
        this.w = Math.cos((thetaDeg * DEG_TO_RAD) * 0.5);
        this.v = axis.GetScaleByNum(Math.sin((thetaDeg * DEG_TO_RAD) * 0.5));

        return this;
    },
    SetMultiplyQuat: function(quat) {
        /// <signature>
        ///  <summary>Multiply by another quaternion</summary>
        ///  <param name="quat" type="Quaternion"></param>
        ///  <returns type="Quaternion" />
        /// </signature>
        var out = new Quaternion();
        out.w = this.w * quat.w - this.v.GetDot(quat.v);
        //var last = this.v.GetCross(quat.v);
        out.v = this.v.GetScaleByNum(quat.w).SetAdd(quat.v.GetScaleByNum(this.w)).SetAdd(this.v.GetCross(quat.v));
        //out.v.Add(last);
        this.SetCopy(out);
        return this;
    },
    GetMultiplyQuat: function(quat) {
        /// <signature>
        ///  <summary>Multiply by another quaternion</summary>
        ///  <param name="quat" type="Quaternion"></param>
        ///  <returns type="Quaternion" />
        /// </signature>
        var out = new Quaternion();
        out.w = this.w * quat.w - this.v.GetDot(quat.v);
        //var last = this.v.GetCross(quat.v);
        out.v = this.v.GetScaleByNum(quat.w).SetAdd(quat.v.GetScaleByNum(this.w)).SetAdd(this.v.GetCross(quat.v));
        //out.v.Add(last);
        return out;
    },
    GetMultiplyVec3: function(vec3) {
        /// <signature>
        ///  <summary>Multiply to modify vector for output</summary>
        ///  <param name="vec3" type="Vector3"></param>
        ///  <returns type="Vector3" />
        /// </signature>
        var temp = this.v.GetCross(vec3);
        var last = (this.v.GetCross(temp)).SetScaleByNum(2.0);
        return vec3.GetAdd(temp.SetScaleByNum(2.0 * this.w)).SetAdd(last);
    },
    GetAngularDiff: function(quat) {
        // Might be more to this?
        return quat.GetMultiplyQuat(this.GetInverse());
    },
    SetIdentity: function() {
        /// <signature>
        ///  <summary>Set axis to 0 and w to 1</summary>
        ///  <returns type="Quaternion" />
        /// </signature>
        this.v.x = 0.0;
        this.v.y = 0.0;
        this.v.z = 0.0;
        this.w = 1.0;
        return this;
    },
    GetDot: function() {
        return this.w * this.w + this.v.GetMagSqr();
    },
    GetMagSqr: function() {
        return this.w * this.w + this.v.GetMagSqr();
    },
    GetMag: function() {
        var magSqr = this.GetMagSqr();
        if (magSqr < INFINITESIMAL)
            return 0;
        return Math.sqrt(magSqr);
    },
    SetNormalized: function() {
        /// <signature>
        ///  <summary>Set to normalized values</summary>
        ///  <returns type="Quaternion" />
        /// </signature>
        var magSqr = this.GetMagSqr();
        if (magSqr < INFINITESIMAL)
            return;
        else if(magSqr > 1.0 - INFINITESIMAL && magSqr < 1.0 + INFINITESIMAL)
            return this;
        var magInv = 1.0 / Math.sqrt(magSqr);
        this.w *= magInv;
        this.v.SetScaleByNum(magInv);
        return this;
    },
    GetNormalized: function() {
        /// <signature>
        ///  <summary>Get normalized values</summary>
        ///  <returns type="Quaternion" />
        /// </signature>
        var magSqr = this.GetMagSqr();
        if (magSqr < INFINITESIMAL)
            return;
        else if(magSqr > 1.0 - INFINITESIMAL && magSqr < 1.0 + INFINITESIMAL)
            return this;
        var magInv = 1.0 / Math.sqrt(magSqr);
        return new Quaternion(this.v.x * magInv, this.v.y * magInv, this.v.z * magInv, this.w * magInv);
    },
    SetConjugate: function() {
        /// <signature>
        ///  <summary>Set to inversed values</summary>
        ///  <returns type="Quaternion" />
        /// </signature>
        this.v.SetNegative();
    },
    GetConjugate: function() {
        /// <signature>
        ///  <summary>Get the inversed quaternion</summary>
        ///  <returns type="Quaternion" />
        /// </signature>
        var vNeg = this.v.GetNegative();
        return new Quaternion(vNeg.x, vNeg.y, vNeg.z, this.w);
    },
    SetInverse: function() {
        var mag = this.GetMag();
        var conj = this.GetConjugate();
        this.SetValues(conj.v.x / mag, conj.v.y / mag, conj.v.z / mag, conj.w / mag);
        return this;
    },
    GetInverse: function() {
        var mag = this.GetMag();
        var conj = this.GetConjugate();
        return new Quaternion(conj.v.x / mag, conj.v.y / mag, conj.v.z / mag, conj.w / mag)
    },
    GetAxis: function() {
        /// <signature>
        ///  <summary>Get the quat x,y,z in vector axis format</summary>
        ///  <returns type="Vector3" />
        /// </signature>
        if (this.v.GetDot(this.v) > INFINITESIMAL)
            return this.v.GetNormalized();
        return this.v.GetCopy();
    },
    GetAngle: function() {
        /// <signature>
        ///  <summary>Get the quat w in degree angle format</summary>
        ///  <returns type="Vector3" />
        /// </signature>
        return RAD_TO_DEG * (Math.acos(this.w) * 2.0);
    },
    GetAxisAngle: function() {
        /// <signature>
        ///  <summary>Get the quat in a Vector4 in axis and angle format</summary>
        ///  <returns type="Vector4" />
        /// </signature>
        if (this.v.GetDot(this.v) > INFINITESIMAL)
            return new Vector4(this.v.GetNormalized(), RAD_TO_DEG * (Math.acos(this.w) * 2.0)); 
        return new Vector4(this.v, RAD_TO_DEG * (Math.acos(this.w) * 2.0));
    },
    CalulateW: function(vec3) {
        /// <signature>
        ///  <summary>Calculate the quat w value from the given vec3</summary>
        ///  <param name="vec3" type="Vector3"></param>
        ///  <returns type="decimal" />
        /// </signature>
        return -Math.sqrt(Math.abs(1.0 - vec3.x * vec3.x - vec3.y * vec3.y - vec3.z * vec3.z));
    }
}