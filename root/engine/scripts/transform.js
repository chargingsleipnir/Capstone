
function Transform(space) {
    // Start in standard position facing down -z
    this.pos = new Vector3();
    this.orient = new Quaternion();
    this.scale = new Vector3(1.0, 1.0, 1.0);
    this.dirFwd = (new Vector3()).SetCopy(VEC3_FWD);
    this.dirUp = (new Vector3()).SetCopy(VEC3_UP);
    this.dirRight = (new Vector3()).SetCopy(VEC3_RIGHT);

    //this.offsetPos = Vector3.CreateZero();
    //this.offsetRot = Vector3.CreateZero();
    //this.offsetScale = Vector3.CreateOne();

    this.active = false;
    this.space = space;
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
    TranslateVec: function(translation) {
        /// <signature>
        ///  <summary>Move position by amount given</summary>
        ///  <param name="translation" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.SetAdd(translation);
        this.active = true;
    },
    TranslateFwd: function(speed) {
        /// <signature>
        ///  <summary>Move position forward by amount given</summary>
        ///  <param name="speed" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.SetAdd(this.dirFwd.GetScaleByNum(speed));
        this.active = true;
    },
    TranslateUp: function(speed) {
        /// <signature>
        ///  <summary>Move position forward by amount given</summary>
        ///  <param name="speed" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.SetAdd(this.dirUp.GetScaleByNum(speed));
        this.active = true;
    },
    TranslateRight: function(speed) {
        /// <signature>
        ///  <summary>Move position forward by amount given</summary>
        ///  <param name="speed" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.SetAdd(this.dirRight.GetScaleByNum(speed));
        this.active = true;
    },
    RotateLocalView: function(axis, thetaDeg) {
        /// <signature>
        ///  <summary>SetOrientation around the given axis by degree specified</summary>
        ///  <param name="thetaDeg" type="decimal"></param>
        ///  <param name="axis" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.dirFwd.SetRotated(thetaDeg, axis);
        this.dirUp.SetRotated(thetaDeg, axis);
        this.dirRight.SetRotated(thetaDeg, axis);
        this.active = true;
    },
    RotateLocalViewX: function(thetaDeg) {
        this.dirFwd.SetRotated(thetaDeg, this.dirRight);
        this.dirUp.SetRotated(thetaDeg, this.dirRight);
        this.active = true;
    },
    RotateLocalViewY: function(thetaDeg) {
        this.dirFwd.SetRotated(thetaDeg, this.dirUp);
        this.dirRight.SetRotated(thetaDeg, this.dirUp);
        this.active = true;
    },
    RotateLocalViewZ: function(thetaDeg) {
        this.dirUp.SetRotated(thetaDeg, this.dirFwd);
        this.dirRight.SetRotated(thetaDeg, this.dirFwd);
        this.active = true;
    },
    SetOrient: function(quat) {
        this.orient.SetCopy(quat);
        this.active = true;
    },
    SetOrientAxisAngle: function(axis, thetaDeg) {
        /// <signature>
        ///  <summary>Set Rotation around given axis by given angle</summary>
        ///  <param name="axis" type="Vector3">Axis around which to rotate</param>
        ///  <param name="thetaDeg" type="decimal">Angle in degrees</param>
        ///  <returns type="void" />
        /// </signature>
        this.orient.SetFromAxisAngle(axis, thetaDeg);
        //this.RotateView(axis, thetaDeg);
        this.active = true;
    },
    Rotate: function(axis, thetaDeg) {
        /// <signature>
        ///  <summary>Apply Rotation around given axis by given angle</summary>
        ///  <param name="axis" type="Vector3">Axis around which to rotate</param>
        ///  <param name="thetaDeg" type="decimal">Angle in degrees</param>
        ///  <returns type="void" />
        /// </signature>
        var rotation = new Quaternion();
        this.orient.SetMultiplyQuat(rotation.SetFromAxisAngle(axis, thetaDeg));
        //this.RotateView(axis, thetaDeg);
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
        /* Accurate representation of directions, but forces use of
        quaternions for everything, which causes too many problems*/
        /*
        this.dirFwd = this.orient.GetMultiplyVec3(VEC3_FWD);
        this.dirUp = this.orient.GetMultiplyVec3(VEC3_UP);
        this.dirRight = this.orient.GetMultiplyVec3(VEC3_RIGHT);
        */

        if (this.active) {
            if(this.space == Space.local)
                this.active = false;

            return true;
        }
        return false;
    }
};