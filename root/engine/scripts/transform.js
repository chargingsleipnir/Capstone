
function Transform(space) {
    // Start in standard position facing down -z
    this.pos = new Vector3();
    this.orient = new Quaternion();
    this.scale = new Vector3(1.0, 1.0, 1.0);

    this.baseTrans = new Vector3();
    this.baseRot = new Quaternion();

    this.offsetTrans = new Vector3();
    this.offsetRot = new Quaternion();

    this.active = false;
    this.space = space;
}
Transform.prototype = {
    SetDefault: function() {
        this.pos.SetZero();
        this.orient.SetIdentity();
        this.scale.SetOne();

        this.baseTrans.SetZero();
        this.baseRot.SetIdentity();

        this.offsetTrans.SetZero();
        this.offsetRot.SetIdentity();

        this.UpdatePos();

        this.active = true;
    },
    GetLargestScaleValue: function() {
        if (this.scale.x > this.scale.y && this.scale.x > this.scale.z)
            return this.scale.x;
        else if (this.scale.y > this.scale.z)
            return this.scale.y;
        else
            return this.scale.z;
    },
    SetBaseTransX: function(x) {
        ///  <summary>Set a new position</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.x = x;
        this.active = true;
        this.UpdatePos();
    },
    SetBaseTransY: function(y) {
        ///  <summary>Set a new position</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.y = y;
        this.active = true;
        this.UpdatePos();
    },
    SetBaseTransZ: function(z) {
        ///  <summary>Set a new position</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.z = z;
        this.active = true;
        this.UpdatePos();
    },
    SetBaseTransByAxes: function(x, y, z) {
        ///  <summary>Set a new position</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <param name="y" type="decimal"></param>
        ///  <param name="z" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.SetValues(x, y, z);
        this.active = true;
        this.UpdatePos();
    },
    SetBaseTransByVec: function(newBaseTrans) {
        /// <signature>
        ///  <summary>Set a new position</summary>
        ///  <param name="position" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.SetCopy(newBaseTrans);
        this.active = true;
        this.UpdatePos();
    },
    SetOffsetTransByAxes: function(x, y, z) {
        ///  <summary>Set a new offset position</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <param name="y" type="decimal"></param>
        ///  <param name="z" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.offsetTrans.x = x;
        this.offsetTrans.y = y;
        this.offsetTrans.z = z;
        this.active = true;
        this.UpdatePos();
    },
    SetOffsetTransByVec: function(pos) {
        /// <signature>
        ///  <summary>Set a new offset position</summary>
        ///  <param name="position" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.offsetTrans.SetCopy(pos);
        this.active = true;
        this.UpdatePos();
    },
    TranslateBaseByAxes: function(x, y, z) {
        ///  <summary>Move position by amount given</summary>
        ///  <param name="x" type="decimal"></param>
        ///  <param name="y" type="decimal"></param>
        ///  <param name="z" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.x += x;
        this.baseTrans.y += y;
        this.baseTrans.z += z;
        this.active = true;
        this.UpdatePos();
    },
    TranslateBaseByVec: function(translation) {
        /// <signature>
        ///  <summary>Move position by amount given</summary>
        ///  <param name="translation" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.SetAdd(translation);
        this.active = true;
        this.UpdatePos();
    },
    TranslateBaseFwd: function(speed) {
        /// <signature>
        ///  <summary>Move position forward by amount given</summary>
        ///  <param name="speed" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.SetAdd(this.orient.GetMultiplyVec3(VEC3_FWD).GetScaleByNum(speed));
        this.active = true;
        this.UpdatePos();
    },
    TranslateBaseUp: function(speed) {
        /// <signature>
        ///  <summary>Move position forward by amount given</summary>
        ///  <param name="speed" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.SetAdd(this.orient.GetMultiplyVec3(VEC3_UP).GetScaleByNum(speed));
        this.active = true;
        this.UpdatePos();
    },
    TranslateBaseRight: function(speed) {
        /// <signature>
        ///  <summary>Move position forward by amount given</summary>
        ///  <param name="speed" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.baseTrans.SetAdd(this.orient.GetMultiplyVec3(VEC3_RIGHT).GetScaleByNum(speed));
        this.active = true;
        this.UpdatePos();
    },
    SetRotation: function(quat) {
        this.orient.SetCopy(quat);
        this.active = true;
        this.UpdatePos();
    },
    SetOffsetRotation: function(quat) {
        this.offsetRot.SetCopy(quat);
        this.active = true;
        this.UpdatePos();
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
        this.UpdatePos();
    },
    SetUpdatedOrient: function(normAxis, thetaDeg) {
        this.orient.UpdateAxisAngle(normAxis, thetaDeg);
        this.active = true;
        this.UpdatePos();
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
        this.active = true;
        this.UpdatePos();
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
    UpdatePos: function() {
        this.pos.SetCopy(this.offsetRot.GetMultiplyVec3(this.offsetTrans).SetAdd(this.baseTrans));
        // would need to do more to account for base Rotation?
    },
    IsChanging: function() {
        /* Accurate representation of directions, but forces use of
        quaternions for everything, which causes too many problems*/
        /*
        this.fwd = this.orient.GetMultiplyVec3(VEC3_FWD);
        this.up = this.orient.GetMultiplyVec3(VEC3_UP);
        this.right = this.orient.GetMultiplyVec3(VEC3_RIGHT);
        */

        if (this.active) {

            if(this.space == Space.local)
                this.active = false;

            return true;
        }
        return false;
    }
};


function TransformAxes() {
    this.pos = new Vector3();
    this.fwd = (new Vector3()).SetCopy(VEC3_FWD);
    this.up = (new Vector3()).SetCopy(VEC3_UP);
    this.right = (new Vector3()).SetCopy(VEC3_RIGHT);
    this.active;
}
TransformAxes.prototype = {
    SetDefault: function() {
        this.pos.SetZero();
        this.fwd.SetCopy(VEC3_FWD);
        this.up.SetCopy(VEC3_UP);
        this.right.SetCopy(VEC3_RIGHT);
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
        this.pos.SetAdd(this.fwd.GetScaleByNum(speed));
        this.active = true;
    },
    TranslateUp: function(speed) {
        /// <signature>
        ///  <summary>Move position forward by amount given</summary>
        ///  <param name="speed" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.SetAdd(this.up.GetScaleByNum(speed));
        this.active = true;
    },
    TranslateRight: function(speed) {
        /// <signature>
        ///  <summary>Move position forward by amount given</summary>
        ///  <param name="speed" type="decimal"></param>
        ///  <returns type="void" />
        /// </signature>
        this.pos.SetAdd(this.right.GetScaleByNum(speed));
        this.active = true;
    },
    RotateLocalView: function(axis, thetaDeg) {
        /// <signature>
        ///  <summary>SetOrientation around the given axis by degree specified</summary>
        ///  <param name="thetaDeg" type="decimal"></param>
        ///  <param name="axis" type="Vector3"></param>
        ///  <returns type="void" />
        /// </signature>
        this.fwd.SetRotated(thetaDeg, axis);
        this.up.SetRotated(thetaDeg, axis);
        this.right.SetRotated(thetaDeg, axis);
        this.active = true;
    },
    RotateLocalViewX: function(thetaDeg) {
        this.fwd.SetRotated(thetaDeg, this.right);
        this.up.SetRotated(thetaDeg, this.right);
        this.active = true;
    },
    RotateLocalViewY: function(thetaDeg) {
        this.fwd.SetRotated(thetaDeg, this.up);
        this.right.SetRotated(thetaDeg, this.up);
        this.active = true;
    },
    RotateLocalViewZ: function(thetaDeg) {
        this.up.SetRotated(thetaDeg, this.fwd);
        this.right.SetRotated(thetaDeg, this.fwd);
        this.active = true;
    },
    IsChanging: function() {
        if (this.active) {
            this.active = false;
            return true;
        }
        return false;
    }
};