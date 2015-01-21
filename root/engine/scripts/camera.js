﻿/*
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
    this.trfmAxes = new TransformAxes();
    this.posGbl = this.trfmAxes.pos.GetCopy();

    // If a component of an object, make it act as it's child
    if(trfmObj) {
        this.trfmObj = trfmObj;
        this.trfmAxes.pos.SetCopy(this.trfmObj.pos);
        this.posGbl = this.trfmAxes.pos.GetCopy();
        this.Update = this.FollowObjectUpdate;
    }

    this.hasKeyCtrl = false;

    this.mtxCam = new Matrix4();
    ViewMngr.frustum.CalculatePlanes(this.trfmAxes.pos, this.trfmAxes.fwd, this.trfmAxes.up, this.trfmAxes.right);
}
Camera.prototype = {
    ToDefaultOrientation: function() {
        this.trfmAxes.SetDefault();
    },
    SetFreeControls: function(ctrlSchemeName, ctrlActive) {
        this.hasKeyCtrl = ctrlActive;
        if(!this.ctrl)
            this.ctrl = new CameraController(this.trfmAxes, ctrlSchemeName);
        else if(ctrlActive)
            this.ctrl.SetInputActive(true);
        else
            this.ctrl.SetInputActive(false);

        this.Update = this.FreeControlUpdate;
    },
    FreeControlUpdate: function() {
        // Update controls
        if(this.active) {

            if (this.hasKeyCtrl) {
                this.ctrl.Update();
            }

            if (this.trfmAxes.IsChanging()) {
                this.posGbl.SetCopy(this.trfmAxes.pos);
                // Update game view
                this.mtxCam.SetOrientation(this.posGbl, this.trfmAxes.fwd, this.trfmAxes.up, this.trfmAxes.right, Space.global);
                ViewMngr.frustum.CalculatePlanes(this.posGbl, this.trfmAxes.fwd, this.trfmAxes.up, this.trfmAxes.right);
            }
        }
    },
    FollowObjectUpdate: function() {
        if(this.active) {

            if (this.hasKeyCtrl) {
                this.ctrl.Update();
            }

            if (this.trfmAxes.IsChanging() || this.trfmObj.IsChanging()) {

                // Use this purely for view rotations
                this.mtxCam.SetOrientation(VEC3_ZERO, this.trfmAxes.fwd, this.trfmAxes.up, this.trfmAxes.right, Space.global);
                //this.mtxCam.SetIdentity();
                // As is in reverse order, translate reversed from the object, then rotate around it, then apply local translation
                this.mtxCam.SetTranslateVec3(this.trfmAxes.pos.GetNegative());
                this.mtxCam.SetRotateAbout(this.trfmObj.orient.GetAxis(), -this.trfmObj.orient.GetAngle());
                this.mtxCam.SetTranslateVec3(this.trfmObj.pos.GetNegative());

                // Use the cam matrix to rotate the local cam position to ensure it's correct global positioning
                var newLocalPos = this.mtxCam.GetMultiplyVec3(this.trfmAxes.pos);
                this.posGbl.SetCopy(newLocalPos.GetAdd(this.trfmObj.pos));
                //this.posGbl = this.mtxCam.GetMultiplyVec3(this.trfmAxes.pos.GetAdd(this.trfmObj.pos));

                // Rotate the directions as well, for proper frustum placement
                var newViewFwd = this.mtxCam.GetMultiplyVec3(this.trfmAxes.fwd);
                var newViewUp = this.mtxCam.GetMultiplyVec3(this.trfmAxes.up);
                var newViewRight = this.mtxCam.GetMultiplyVec3(this.trfmAxes.right);

                //this.trfmAxes.fwd = this.trfmObj.orient.GetMultiplyVec3(VEC3_FWD);
                //this.trfmAxes.up = this.trfmObj.orient.GetMultiplyVec3(VEC3_UP);
                //this.trfmAxes.right = this.trfmObj.orient.GetMultiplyVec3(VEC3_RIGHT);


                ViewMngr.frustum.CalculatePlanes(this.posGbl, newViewFwd, newViewUp, newViewRight);

                /*
                ViewMngr.frustum.CalculatePlanes(
                    this.posGbl,
                    this.trfmObj.orient.GetMultiplyVec3(VEC3_FWD),
                    this.trfmObj.orient.GetMultiplyVec3(VEC3_UP),
                    this.trfmObj.orient.GetMultiplyVec3(VEC3_RIGHT)
                );
                */
            }
        }
    }
};