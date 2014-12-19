
function FPController() {
    this.obj;

    this.ctrl = new ControlScheme();
    this.moveSpeed = 0.01;
    this.turnSpeed = 0.5;

    this.pitchAngle = 0.0;
    this.yawAngle = 0.0;

    // Control camera
    var camRegName = "First Person Controller";
    Input.RegisterObject(camRegName, true);

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
            this.obj.trfmLocal.TranslateAxes(this.moveSpeed, 0.0, 0.0);
        }
        else if(this.ctrl.moveRight.pressed) {
            this.obj.trfmLocal.TranslateAxes(-this.moveSpeed, 0.0, 0.0);
        }
        if(this.ctrl.moveUp.pressed) {
            this.obj.trfmLocal.TranslateAxes(0.0, -this.moveSpeed, 0.0);
        }
        else if(this.ctrl.moveDown.pressed) {
            this.obj.trfmLocal.TranslateAxes(0.0, this.moveSpeed, 0.0);
        }
        if(this.ctrl.moveForth.pressed) {
            this.obj.trfmLocal.TranslateAxes(0.0, 0.0, this.moveSpeed);
        }
        else if(this.ctrl.moveBack.pressed) {
            this.obj.trfmLocal.TranslateAxes(0.0, 0.0, -this.moveSpeed);
        }
        if(this.ctrl.pitchUp.pressed) {
            this.pitchAngle -= this.turnSpeed;
            this.obj.trfmLocal.SetRotation(this.obj.trfmLocal.dirRight, this.pitchAngle);
        }
        else if(this.ctrl.pitchDown.pressed) {
            this.pitchAngle += this.turnSpeed;
            this.obj.trfmLocal.SetRotation(this.obj.trfmLocal.dirRight, this.pitchAngle);
        }
        if(this.ctrl.yawLeft.pressed) {
            this.yawAngle -= this.turnSpeed;
            this.obj.trfmLocal.SetRotation(this.obj.trfmLocal.dirUp, this.yawAngle);
        }
        else if(this.ctrl.yawRight.pressed) {
            this.yawAngle += this.turnSpeed;
            this.obj.trfmLocal.SetRotation(this.obj.trfmLocal.dirUp, this.yawAngle);
        }

    }
};
