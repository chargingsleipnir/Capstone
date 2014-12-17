
function Transform() {
    // Start in standard position facing down -z
    this.pos = new Vector3(0.0, 0.0, 0.0);
    this.dirFwd = (new Vector3()).SetCopy(GBL_FWD);
    this.dirUp = (new Vector3()).SetCopy(GBL_UP);
    this.orient = new Quaternion();
    this.scale = new Vector3(1.0, 1.0, 1.0);

    //this.offsetPos = Vector3.CreateZero();
    //this.offsetRot = Vector3.CreateZero();
    //this.offsetScale = Vector3.CreateOne();

    this.active = false;
}
Transform.prototype = {
    GetLargestScaleValue: function() {
        if (this.scale.x > this.scale.y && this.scale.x > this.scale.z)
            return this.scale.x;
        else if (this.scale.y > this.scale.z)
            return this.scale.y;
        else
            return this.scale.z;
    },
    SetPosAxes: function(x, y, z) {
        ///  <summary>Set a new position</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <param name="y" type="decimal"></param>
        ///  <param name="z" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.x = x;
        this.pos.y = y;
        this.pos.z = z;
        this.active = true;
    },
    SetPosVec3: function(pos) {
        /// <signature>
        ///  <summary>Set a new position</summary>
        ///  <param name="position" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.SetCopy(pos);
        this.active = true;
    },
    TranslateAxes: function(x, y, z) {
        ///  <summary>Move position by amount given</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <param name="y" type="decimal"></param>
        ///  <param name="z" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.x += x;
        this.pos.y += y;
        this.pos.z += z;
        this.active = true;
    },
    TranslateVec3: function(translation) {
        /// <signature>
        ///  <summary>Move position by amount given</summary>
        ///  <param name="translation" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.SetAdd(translation);
        this.active = true;
    },
    //SetOrientation: function(dirFwd, dirUp) {
    //    //this.staticDirFwd.Set(dirFwd.Normalize());
    //    //this.staticDirUp.Set(dirUp.Normalize());
    //    this.dirFwd.Set(dirFwd.Normalize());
    //    this.dirUp.Set(dirUp.Normalize());
    //    this.active = true;
    //},
    RotateView: function(thetaDeg, axis) {
        /// <signature>
        ///  <summary>Rotate around the given axis by degree specified</summary>
        ///  <param name="thetaDeg" type="decimal"></param>
        ///  <param name="axis" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.dirFwd.SetRotated(thetaDeg, axis.GetCopy());
        this.dirUp.SetRotated(thetaDeg, axis.GetCopy());
        this.active = true;
    },
    Rotate: function(axis, thetaDeg) {
        /// <signature>
        ///  <summary>Rotate around given axis by given angle</summary>
        ///  <param name="axis" type="Vector3">Axis around which to rotate</param>
        ///  <param name="thetaDeg" type="decimal">Angle in degrees</param>
        ///  <returns type="void" />
        /// </signature>
        this.orient.SetAxisAngle(axis, thetaDeg);
        this.active = true;
    },
    SetScaleAxes: function(x, y, z) {
        /// <summary>Set a new scale</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <param name="y" type="decimal"></param>
        ///  <param name="z" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
        this.active = true;
    },
    SetScaleVec3: function(scaleVec) {
        /// <signature>
        ///  <summary>Set a new scale</summary>
        ///  <param name="scaleVec" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.scale.SetCopy(scaleVec);
        this.active = true;
    },
    ScaleAxes: function(x, y, z) {
        /// <summary>Grow/shrink by value given</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <param name="y" type="decimal"></param>
        ///  <param name="z" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.scale.x += x;
        this.scale.y += y;
        this.scale.z += z;
        this.active = true;
    },
    ScaleVec3: function(scaleVec) {
        /// <signature>
        ///  <summary>Grow/shrink by value given</summary>
        ///  <param name="scaleVec" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.scale.SetAdd(scaleVec);
        this.active = true;
    },
    IsChanging: function() {
        if (this.active) {
            this.active = false;
            return true;
        }
        return false;
    }
}