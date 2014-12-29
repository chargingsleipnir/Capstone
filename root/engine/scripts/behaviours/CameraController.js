
function CameraController(trfm) {
    this.trfm = trfm;

    this.ctrl = new ControlScheme();
    this.moveSpeed = 10;
    this.turnSpeed = 1.0;

    this.pitchAngle = 0.0;
    this.yawAngle = 0.0;

    // Control camera
    var camRegName = "First Person Controller";
    Input.RegisterControlScheme(camRegName, true);

    this.ctrl.moveLeft = Input.CreateInputController(camRegName, KeyMap.A);
    this.ctrl.moveRight = Input.CreateInputController(camRegName, KeyMap.D);
    this.ctrl.moveDown = Input.CreateInputController(camRegName, KeyMap.Q);
    this.ctrl.moveUp = Input.CreateInputController(camRegName, KeyMap.E);
    this.ctrl.moveBack = Input.CreateInputController(camRegName, KeyMap.S);
    this.ctrl.moveForth = Input.CreateInputController(camRegName, KeyMap.W);
    this.ctrl.pitchDown = Input.CreateInputController(camRegName, KeyMap.ArrowDown);
    this.ctrl.pitchUp = Input.CreateInputController(camRegName, KeyMap.ArrowUp);
    this.ctrl.yawLeft = Input.CreateInputController(camRegName, KeyMap.ArrowLeft);
    this.ctrl.yawRight = Input.CreateInputController(camRegName, KeyMap.ArrowRight);

    this.active = false;
}
CameraController.prototype = {
    Update: function() {
        if(this.active) {
            if (this.ctrl.moveLeft.pressed) {
                this.trfm.TranslateRight(-this.moveSpeed * Time.delta_Milli);
            }
            else if (this.ctrl.moveRight.pressed) {
                this.trfm.TranslateRight(this.moveSpeed * Time.delta_Milli);
            }
            if (this.ctrl.moveUp.pressed) {
                this.trfm.TranslateUp(this.moveSpeed * Time.delta_Milli);
            }
            else if (this.ctrl.moveDown.pressed) {
                this.trfm.TranslateUp(-this.moveSpeed * Time.delta_Milli);
            }
            if (this.ctrl.moveForth.pressed) {
                this.trfm.TranslateFwd(this.moveSpeed * Time.delta_Milli);
            }
            else if (this.ctrl.moveBack.pressed) {
                this.trfm.TranslateFwd(-this.moveSpeed * Time.delta_Milli);
            }
            if (this.ctrl.pitchUp.pressed) {
                this.trfm.RotateLocalViewX(this.turnSpeed);
                //this.trfm.Rotate(this.trfm.dirRight, -this.turnSpeed);
            }
            else if (this.ctrl.pitchDown.pressed) {
                this.trfm.RotateLocalViewX(-this.turnSpeed);
                //this.trfm.Rotate(this.trfm.dirRight, this.turnSpeed);
            }
            if (this.ctrl.yawLeft.pressed) {
                this.trfm.RotateLocalView(VEC3_UP, this.turnSpeed);
                //this.trfm.Rotate(VEC3_UP, this.turnSpeed);
            }
            else if (this.ctrl.yawRight.pressed) {
                this.trfm.RotateLocalView(VEC3_UP, -this.turnSpeed);
                //this.trfm.Rotate(VEC3_UP, -this.turnSpeed);
            }
        }
    }
};
