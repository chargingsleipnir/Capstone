/**
 * Created by Devin on 2014-12-29.
 */

function BuildScene3(scene, skyBoxObj) {

    var grid = new GameObject('grid', Labels.productionEnvironment);
    grid.SetModel(Primitives.grid);
    grid.AddComponent(Components.modelHandler);
    grid.trfmLocal.SetScaleAxes(10.0, 0.0, 10.0);

    var balls = [];
    var startPositions = [
        new Vector3(-5.0, 1.0, -4.0),
        new Vector3(-5.75, 1.0, -12.0),
        new Vector3(1.5, 1.0, -14.0),
        new Vector3(-11.0, 1.0, -19.0)
    ];

    for(var i = 0; i < 4; i++) {
        balls[i] = new GameObject('physics test ball', Labels.testObject);
        balls[i].SetModel(new Primitives.IcoSphere(2, 1));
        balls[i].AddComponent(Components.modelHandler);
        balls[i].mdlHdlr.MakeWireFrame();
        balls[i].mdlHdlr.colourTint.SetValues(Math.sin(i), Math.cos(i), Math.tan(i));
        balls[i].trfmLocal.SetPosVec3(startPositions[i]);

        balls[i].AddComponent(Components.collisionBody);
        //balls[i].collider.SetBoundingShape(BoundingShapes.aabb);

        balls[i].AddComponent(Components.rigidBody);
        balls[i].AddScript(new ImpulseBalls());
    }

    scene.rootObj.AddComponent(Components.camera);
    scene.rootObj.camera.SetControlsActive(scene.name, false);

    balls[0].AddComponent(Components.camera);
    balls[0].camera.SetControlsActive(balls[0].name, true);

    var physicsTestName = "PhysicsTestScene";
    Input.RegisterControlScheme(physicsTestName, false);
    var launch = Input.CreateInputController(physicsTestName, KeyMap.Z);
    var gotoTitle = Input.CreateInputController(physicsTestName, KeyMap.Enter);
    var launchForce = new Vector3(0.0, 0.0, -250.0);

    var angle = 0.01;

    function Start() {
        Input.SetActive(physicsTestName, true);

        ViewMngr.SetActiveCamera(balls[0].camera);
    }

    function Update() {
        if(launch.pressed){
            balls[0].rigidBody.AddForce(launchForce);
            DebugMngr.SetFullActive(false);
            DebugMngr.active = true;
            DebugMngr.dispRays = true;
            launch.Release();
        }
        if(gotoTitle.pressed) {
            gotoTitle.Release();
            SceneMngr.SetActive("Title Screen");
        }

        skyBoxObj.trfmLocal.Rotate(VEC3_FWD, angle);
    }

    function End() {
        DebugMngr.SetFullActive(true);

        for(var i = 0; i < 4; i++) {
            balls[i].trfmLocal.SetPosVec3(startPositions[i]);
            balls[i].rigidBody.velFinal.SetZero();
        }

        //ViewMngr.activeCam.ToDefaultOrientation();
        Input.SetActive(physicsTestName, false);
    }

    scene.Add(grid);
    for(var i = 0; i < 4; i++)
        scene.Add(balls[i]);

    scene.SetCallbacks(Start, Update, End);
}