/*
function Frustum(mtxProj, fovY, ratio, boundNear, boundFar, pos, dirFwd, dirUp) {

    mtxProj.SetPerspective(fovY, ratio, boundNear, boundFar);

    this.planes = [6];
    for (var i = 0; i < 6; i++)
        this.planes[i] = new Plane();

    var tanThetaRad = Math.tan(DEG_TO_RAD * (fovY / 2.0));
    var d = 1.0 / tanThetaRad;
    this.distNear = boundNear + d;
    this.distFar = boundFar + d;

    this.radiiNear = new Vector2();
    this.radiiNear.y = tanThetaRad * this.distNear;
    this.radiiNear.x = this.radiiNear.y * ratio;
    this.radiiFar = new Vector2();
    this.radiiFar.y = tanThetaRad * this.distFar;
    this.radiiFar.x = this.radiiFar.y * ratio;

    this.CalculatePlanes(pos, dirFwd, dirUp);
}
*/
function Frustum() {

    this.planes = [6];
    for (var i = 0; i < 6; i++)
        this.planes[i] = new Plane();
}
Frustum.prototype = {
    SetFromMtx: function(mtx) {

        this.planes[Planes.left].norm.SetValues(
            mtx.data[12] + mtx.data[0],
            mtx.data[13] + mtx.data[1],
            mtx.data[14] + mtx.data[2]
        );
        this.planes[Planes.left].dist = mtx.data[15] + mtx.data[3];

        this.planes[Planes.right].norm.SetValues(
            mtx.data[12] - mtx.data[0],
            mtx.data[13] - mtx.data[1],
            mtx.data[14] - mtx.data[2]
        );
        this.planes[Planes.right].dist = mtx.data[15] - mtx.data[3];

        this.planes[Planes.bottom].norm.SetValues(
            mtx.data[12] + mtx.data[4],
            mtx.data[13] + mtx.data[5],
            mtx.data[14] + mtx.data[6]
        );
        this.planes[Planes.bottom].dist = mtx.data[15] + mtx.data[7];

        this.planes[Planes.top].norm.SetValues(
            mtx.data[12] - mtx.data[4],
            mtx.data[13] - mtx.data[5],
            mtx.data[14] - mtx.data[6]
        );
        this.planes[Planes.top].dist = mtx.data[15] - mtx.data[7];

        this.planes[Planes.near].norm.SetValues(
            mtx.data[12] + mtx.data[8],
            mtx.data[13] + mtx.data[9],
            mtx.data[14] + mtx.data[10]
        );
        this.planes[Planes.near].dist = mtx.data[15] + mtx.data[11];

        this.planes[Planes.far].norm.SetValues(
            mtx.data[12] - mtx.data[8],
            mtx.data[13] - mtx.data[9],
            mtx.data[14] - mtx.data[10]
        );
        this.planes[Planes.far].dist = mtx.data[15] - mtx.data[11];

        for (var i = 0; i < 6; i++)
            this.planes[i].SetNormalized();
    },
    CalculatePlanes: function(pos, dirFwd, dirUp) {
        var dirRight = dirFwd.GetCross(dirUp);

        // Compute centre and corners of near and far planes
        var posNear = pos.GetAdd(dirFwd.GetScaleByNum(this.distNear));
        var topNear = dirUp.GetScaleByNum(this.radiiNear.y);
        var rightNear = dirRight.GetScaleByNum(this.radiiNear.x);

        var posFar = pos.GetAdd(dirFwd.GetScaleByNum(this.distFar));
        var topFar = dirUp.GetScaleByNum(this.radiiFar.y);
        var rightFar = dirRight.GetScaleByNum(this.radiiFar.x);

        var nearTL = posNear.GetAdd(topNear).SetSubtract(rightNear);
        var nearTR = posNear.GetAdd(topNear).SetAdd(rightNear);
        var nearBL = posNear.GetSubtract(topNear).SetSubtract(rightNear);
        var nearBR = posNear.GetSubtract(topNear).SetAdd(rightNear);

        var farTL = posFar.GetAdd(topFar).SetSubtract(rightFar);
        var farTR = posFar.GetAdd(topFar).SetAdd(rightFar);
        var farBL = posFar.GetSubtract(topFar).SetSubtract(rightFar);
        var farBR = posFar.GetSubtract(topFar).SetAdd(rightFar);

        this.planes[Planes.left].SetFromPoints(nearTL, nearBL, farTL);
        this.planes[Planes.right].SetFromPoints(nearTR, farTR, nearBR);
        this.planes[Planes.bottom].SetFromPoints(nearBL, nearBR, farBL);
        this.planes[Planes.top].SetFromPoints(nearTL, farTL, nearTR);
        this.planes[Planes.far].SetFromPoints(farTL, farBL, farTR);
        this.planes[Planes.near].SetFromPoints(nearTL, nearTR, nearBL);
    },
    IntersectsPoint: function(point) {
        for (var i = 0; i < 6; i++)
            if (this.planes[i].DistanceTo(point) <= 0)
                return false;
        return true;
    },
    IntersectsAABB: function(box) {
        for (var i = 0; i < 6; i++)
            if (this.planes[i].DistanceTo(box.GetCornerFurthestAlong(this.planes[i].norm)) <= 0)
                return false;
        return true;
    },
    IntersectsSphere: function(sphere) {
        for (var i = 0; i < 6; i++)
            if (this.planes[i].DistanceTo(sphere.pos) + sphere.radius <= 0)
                return false;
        return true;
    }
};

function Camera(trfmObj) {

    this.trfmObj = trfmObj;
    this.trfm = new Transform();
    this.trfm.pos.SetCopy(this.trfmObj.pos);

    this.mtxCam = new Matrix4();
    // Make proj matrix with frustum
    this.mtxProj = new Matrix4();
    this.mtxProj.SetPerspective(45.0, GM.wndWidth / GM.wndHeight, 0.1, 200.0);
    //this.frustum = new Frustum(this.mtxProj, 45.0, wndWidth / wndHeight, 0.1, 200.0, pos, dirFwd, dirUp);
    this.mtxProjView = this.mtxCam.GetMultiply(this.mtxProj);

    this.frustum = new Frustum();
    this.frustum.SetFromMtx(this.mtxProjView);

    this.active = false;
    GM.SetActiveCamera(this);
}
Camera.prototype = {
    RunGUI: function() {
        /*
        this.obj.SetModel(new Primitives.Rect(new Vector2(0.1, 0.1)));
        this.obj.AddComponent(Components.modelHandler);
        this.obj.mdlHdlr.SetTexture(TwoD.GetCanvas());
        this.obj.mdlHdlr.colourTint.SetValues(1.0, 0.0, 1.0);
        //GM.rootObj.AddChild(this.obj);
        */
    },
    SetControlsActive: function(ctrlActive) {
        if(!this.ctrl)
            this.ctrl = new CameraController(this.trfm);

        this.ctrl.active = ctrlActive;
    },
    Update: function() {
        // Update controls
        if(this.ctrl)
            this.ctrl.Update();

        if (this.active && (this.trfm.IsChanging() || this.trfmObj.IsChanging())) {

            /* This same kind of parent-child updating is what makes it at all
            * valuable to add a camera as a component of a gameObject */

            var newPos = this.trfm.pos.GetAdd(this.trfmObj.pos);
            var newOrient = this.trfm.orient.GetMultiplyQuat(this.trfmObj.orient);
            /*
            var newDirFwd.SetCopy(this.trfmLocal.dirFwd);
            //this.trfmGlobal.dirFwd.Add(trfmParent.dirFwd);
            var newDirUp.SetCopy(this.trfmLocal.dirUp);
            //this.trfmGlobal.dirUp.Add(trfmParent.dirUp);
            var newDirRight.SetCopy(this.trfmLocal.dirRight);
            */

            // Update game view
            this.mtxCam.SetOrientation(newPos, this.trfm.dirFwd, this.trfm.dirUp, this.trfm.dirRight, Space.global);

            /* Use these to adjust controls, if set by user, to rotate camera around object.
             * Allow user to set camera modes...
             * This is where pushing and popping matrices will come into play!! */
            //this.mtxCam.SetTranslateVec3(this.trfmObj.pos);
            //this.mtxCam.SetRotateAbout(newOrient.GetAxis(), -newOrient.GetAngle());
            //this.mtxCam.SetTranslateVec3(this.trfmObj.pos.GetNegative());

            //this.mtxCam.SetScaleVec3(this.trfmObj.scale);
            this.mtxProjView = this.mtxCam.GetMultiply(this.mtxProj);
            this.frustum.SetFromMtx(this.mtxProjView);
            //this.frustum.CalculatePlanes(this.trfm.pos, this.trfm.dirFwd, this.trfm.dirUp);
        }
    }
    /*
    UpdatePlanes: function(near, far) {
        if (this.trfm.IsChanging()) {
            this.mtxProj.SetPerspective(45.0, GM.wndWidth / GM.wndHeight, near, far);
        }
    }
    */
};