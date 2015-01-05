
function FPController() {
    this.obj;

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

}
FPController.prototype = {
    Initialize: function(gameObject) {
        this.obj = gameObject;
    },
    Update: function() {

        if(this.ctrl.moveLeft.pressed) {
            this.obj.trfmLocal.TranslateRight(-this.moveSpeed * Time.deltaMilli);
        }
        else if(this.ctrl.moveRight.pressed) {
            this.obj.trfmLocal.TranslateRight(this.moveSpeed * Time.deltaMilli);
        }
        if(this.ctrl.moveUp.pressed) {
            this.obj.trfmLocal.TranslateUp(this.moveSpeed * Time.deltaMilli);
        }
        else if(this.ctrl.moveDown.pressed) {
            this.obj.trfmLocal.TranslateUp(-this.moveSpeed * Time.deltaMilli);
        }
        if(this.ctrl.moveForth.pressed) {
            this.obj.trfmLocal.TranslateFwd(this.moveSpeed * Time.deltaMilli);
        }
        else if(this.ctrl.moveBack.pressed) {
            this.obj.trfmLocal.TranslateFwd(-this.moveSpeed * Time.deltaMilli);
        }
        if(this.ctrl.pitchUp.pressed) {
            this.obj.trfmLocal.RotateLocalViewX(this.turnSpeed);
            //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.right, -this.turnSpeed);
        }
        else if(this.ctrl.pitchDown.pressed) {
            this.obj.trfmLocal.RotateLocalViewX(-this.turnSpeed);
            //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.right, this.turnSpeed);
        }
        if(this.ctrl.yawLeft.pressed) {
            this.obj.trfmLocal.RotateLocalView(VEC3_UP, this.turnSpeed);
            //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.up, this.turnSpeed);
        }
        else if(this.ctrl.yawRight.pressed) {
            this.obj.trfmLocal.RotateLocalView(VEC3_UP, -this.turnSpeed);
            //this.obj.trfmLocal.Rotate(this.obj.trfmLocal.up, -this.turnSpeed);
        }
    }
};
