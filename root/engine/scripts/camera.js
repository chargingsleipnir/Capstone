
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
Frustum.prototype = {
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

function Camera(gameObject, wndWidth, wndHeight) {

    this.obj = gameObject;

    this.mtxCam = new Matrix4();
    // Make proj matrix with frustum
    this.mtxProj = new Matrix4();
    this.mtxProj.SetPerspective(45.0, wndWidth / wndHeight, 0.1, 200.0);
    //this.frustum = new Frustum(this.mtxProj, 45.0, wndWidth / wndHeight, 0.1, 200.0, pos, dirFwd, dirUp);
    this.mtxProjView = this.mtxCam.GetMultiply(this.mtxProj);

    this.gui = null;
}
Camera.prototype = {
    /*
    SetCopy: function(camera) {
        this.pos.SetCopy(camera.pos);
        this.dirFwd.SetCopy(camera.dirFwd);
        this.dirUp.SetCopy(camera.dirUp);
        this.trfm.active = true;
        return this;
    },
    GetCopy: function() {
        return new Camera(this.trfm.pos, this.trfm.dirFwd, this.trfm.dirUp);
    },
    */
    Update: function() {
        //if (this.trfm.IsChanging()) {
            //this.mtxCam.SetOrientation(this.trfm.pos, this.trfm.dirFwd, this.trfm.dirUp, Space.global);
            //this.frustum.CalculatePlanes(this.trfm.pos, this.trfm.dirFwd, this.trfm.dirUp);
        //}
        this.obj.Update(this.obj.trfmLocal);
        if (this.obj.trfmLocal.IsChanging()) {
            this.mtxCam.SetIdentity();
            this.mtxCam.SetTranslateVec3(this.obj.trfmLocal.pos);
            this.mtxCam.SetRotateAbout(this.obj.trfmLocal.orient.GetAxis(), this.obj.trfmLocal.orient.GetAngle());
            this.mtxCam.SetScaleVec3(this.obj.trfmLocal.scale);
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