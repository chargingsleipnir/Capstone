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

function Frustum(mtxProj, verticalViewThetaDeg, aspectRatio, boundNear, boundFar) {

    this.planes = [6];
    for (var i = 0; i < 6; i++)
        this.planes[i] = new Plane();

    var tanTheta = Math.tan((verticalViewThetaDeg * DEG_TO_RAD) / 2.0);
    /* I could add "d" to these amounts, but it only seems to screw things up
     * if I want a tight frustum, close to the camera. */
    this.planeNearDist = boundNear;
    this.planeFarDist = boundFar;

    this.planeNearRadii = new Vector2();
    this.planeNearRadii.y = tanTheta * this.planeNearDist;
    this.planeNearRadii.x = this.planeNearRadii.y * aspectRatio;

    this.planeFarRadii = new Vector2();
    this.planeFarRadii.y = tanTheta * this.planeFarDist;
    this.planeFarRadii.x = this.planeFarRadii.y * aspectRatio;

    // BUILD PROJECTION MATRIX RIGHT HERE - WHY NOT...
    var d = 1.0 / tanTheta;
    var nf = 1.0 / (boundNear - boundFar);
    mtxProj.SetElems(
        d / aspectRatio, 0.0, 0.0,                               0.0,
        0.0,             d,   0.0,                               0.0,
        0.0,             0.0, (boundFar + boundNear) * nf,       -1.0,
        0.0,             0.0, (2.0 * boundFar * boundNear) * nf, 0.0
    );
}
Frustum.prototype = {

    // CANNOT MAKE THIS BS FUNCTION WORK.
    // The distances don't change. The norms just constantly rotate
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
    CalculatePlanes: function(pos, dirFwd, dirUp, dirRight) {

        // COMPUTE NEAR CORNERS
        var posNear = pos.GetAddScaled(dirFwd, this.planeNearDist);
        var topNear = dirUp.GetScaleByNum(this.planeNearRadii.y);
        var rightNear = dirRight.GetScaleByNum(this.planeNearRadii.x);

        var nearTL = posNear.GetAdd(topNear).SetSubtract(rightNear);
        var nearTR = posNear.GetAdd(topNear).SetAdd(rightNear);
        var nearBL = posNear.GetSubtract(topNear).SetSubtract(rightNear);
        var nearBR = posNear.GetSubtract(topNear).SetAdd(rightNear);

        // COMPUTE FAR CORNERS
        var posFar = pos.GetAddScaled(dirFwd, this.planeFarDist);
        var topFar = dirUp.GetScaleByNum(this.planeFarRadii.y);
        var rightFar = dirRight.GetScaleByNum(this.planeFarRadii.x);

        var farTL = posFar.GetAdd(topFar).SetSubtract(rightFar);
        var farTR = posFar.GetAdd(topFar).SetAdd(rightFar);
        var farBL = posFar.GetSubtract(topFar).SetSubtract(rightFar);
        var farBR = posFar.GetSubtract(topFar).SetAdd(rightFar);

        // GET PLANES FROM CORNERS
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

    this.active = false;

    this.trfmObj = trfmObj;
    this.trfm = new Transform(Space.local);
    this.trfm.pos.SetCopy(this.trfmObj.pos);
    this.posGbl = this.trfm.pos;

    this.hasKeyCtrl = false;

    this.mtxCam = new Matrix4();

    ViewMngr.frustum.CalculatePlanes(this.trfm.pos, this.trfm.dirFwd, this.trfm.dirUp, this.trfm.dirRight);
}
Camera.prototype = {
    ToDefaultOrientation: function() {
        this.trfm.ToDefault();
    },
    SetControlsActive: function(ctrlSchemeName, ctrlActive) {
        this.hasKeyCtrl = ctrlActive;
        if(!this.ctrl)
            this.ctrl = new CameraController(this.trfm, ctrlSchemeName);
        else if(ctrlActive)
            this.ctrl.SetInputActive(true);
        else
            this.ctrl.SetInputActive(false);
    },
    Update: function() {
        // Update controls
        if(this.active) {

            if (this.hasKeyCtrl) {
                this.ctrl.Update();
            }

            if (this.trfm.IsChanging() || this.trfmObj.IsChanging()) {

                /* This same kind of parent-child updating is what makes it at all
                 * valuable to add a camera as a component of a gameObject */


                this.posGbl = this.trfm.pos.GetAdd(this.trfmObj.pos);
                //var newOrient = this.trfm.orient.GetMultiplyQuat(this.trfmObj.orient);
                /*
                 var newDirFwd.SetCopy(this.trfmLocal.dirFwd);
                 //this.trfmGlobal.dirFwd.Add(trfmParent.dirFwd);
                 var newDirUp.SetCopy(this.trfmLocal.dirUp);
                 //this.trfmGlobal.dirUp.Add(trfmParent.dirUp);
                 var newDirRight.SetCopy(this.trfmLocal.dirRight);
                 */
                // Update game view
                this.mtxCam.SetOrientation(this.posGbl, this.trfm.dirFwd, this.trfm.dirUp, this.trfm.dirRight, Space.global);
                ViewMngr.frustum.CalculatePlanes(this.posGbl, this.trfm.dirFwd, this.trfm.dirUp, this.trfm.dirRight);

                /* Use these to adjust controls, if set by user, to rotate camera around object.
                 * Allow user to set camera modes...
                 * This is where pushing and popping matrices will come into play!! */
                //this.mtxCam.SetIdentity();
                //this.mtxCam.SetTranslateVec3(this.trfmObj.pos);
                //this.mtxCam.SetRotateAbout(newOrient.GetAxis(), -newOrient.GetAngle());
                //this.mtxCam.SetTranslateVec3(this.trfmObj.pos.GetNegative());

                //this.mtxCam.SetScaleVec3(this.trfmObj.scale);
            }
        }
    }
};