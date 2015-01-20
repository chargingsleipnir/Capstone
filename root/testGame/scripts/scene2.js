/**
 * Created by Devin on 2014-12-29.
 */

function BuildScene2(scene, playerObj) {

    var arrow = new GameObject('arrow', Labels.testObject);
    var heart = new GameObject('heart', Labels.testObject);
    var testCube = new GameObject('test cube', Labels.testObject);
    var cube = new GameObject('primitive cube', Labels.testObject);

    arrow.SetModel(Primitives.arrow);
    heart.SetModel(Primitives.heart);
    testCube.SetModel(EL.assets.models['dimensionBox']);
    cube.SetModel(new Primitives.Cube(new Vector3(1.5, 3.0, 4.5), true));

    testCube.mdlHdlr.SetTexture(EL.assets.textures['logo'], TextureFilters.linear);
    cube.mdlHdlr.SetTexture(EL.assets.textures['questionBlock'], TextureFilters.linear);

    arrow.trfmLocal.SetPosAxes(5.5, 1.0, -2.5);
    heart.trfmLocal.SetPosVec3(new Vector3(4.0, 0.5, -1.0));
    cube.trfmLocal.SetPosVec3(new Vector3(-10.5, 0.0, -20.0));

    arrow.mdlHdlr.SetTintRGB(-0.2, 0.3, 0.5);
    heart.mdlHdlr.SetTintRGB(-0.2, 0.3, 0.5);
    cube.mdlHdlr.SetTintRGB(0.0, 0.5, 0.5);

    arrow.AddComponent(Components.collisionBody);
    heart.AddComponent(Components.collisionBody);
    testCube.AddComponent(Components.collisionBody);

    playerObj.AddChild(arrow);
    playerObj.AddChild(heart);

    /******************************** GOOD TIME TO MAKE A HUD *************************************************/

    var hud = new GUISystem(new WndRect(20, 20, ViewMngr.wndWidth - 40, ViewMngr.wndHeight - 40), "in-game HUD");

    var style = new MsgBoxStyle();
    style.fontSize = 30;
    style.fontColour = new Vector3(1.0, 1.0, 1.0);
    style.textMaxWidth = 60;
    style.textAlignWidth = Alignment.right;
    style.textAlignHeight = Alignment.bottom;
    style.bgTexture = null;
    style.bgColour = new Vector3(0.0, 0.25, 0.0);
    style.textLineSpacing = 15.0;
    style.margin = 5.0;
    style.bgAlpha = 0.8;
    style.bold = false;
    var greenMsg = new GUIObject(new WndRect(0, 0, 300, 300), "$100 is 16% if the #stupid amount of tuition we pay!! Write devinodin@gmail.com", style);
    hud.AddGUIObject(greenMsg);

    style.bgColour = new Vector3(0.0, 0.0, 0.25);
    style.fontSize = 25;
    style.textAlignWidth = Alignment.left;
    style.textAlignHeight = Alignment.top;
    style.textLineSpacing = 10.0;
    style.bold = false;
    var blueMsg = new GUIObject(new WndRect(2000, 50, 200, 200), "Does this work?? \\\\Show me \"escaped\" characters", style);
    hud.AddGUIObject(blueMsg);

    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.fontSize = 15;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.textLineSpacing = 5.0;
    style.bgAlpha = 1.0;
    style.bold = true;
    style.bgTexture = EL.assets.textures['questionBlock'];
    var redMsg = new GUIObject(new WndRect(30, 600, 100, 100), "Another test message box. I need to make a better font...", style);
    hud.AddGUIObject(redMsg);

    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.fontColour = new Vector3(1.0, 1.0, 1.0);
    style.fontSize = 30;
    style.textLineSpacing = 0.0;
    style.bgAlpha = 0.5;
    style.bgTexture = EL.assets.textures['purply'];
    style.bold = false;
    var aquaMsg = new GUIObject(new WndRect(redMsg.rectLocal.x + redMsg.rectLocal.w + 30 , redMsg.rectLocal.y, 200, 100), "Size", style);
    hud.AddGUIObject(aquaMsg);

    GUINetwork.AddSystem(hud, false);
    /******************************** End HUD *************************************************/

    // apply camera control
    scene.rootObj.AddComponent(Components.camera);
    scene.rootObj.camera.SetFreeControls(scene.name, true);

    var waveringValue = 0.0;
    var timer = 0.0;

    var ctrlSchemeName = "In-game menu control";
    Input.RegisterControlScheme(ctrlSchemeName, false, InputTypes.keyboard);
    var resetBtn = Input.CreateInputController(ctrlSchemeName, KeyMap.Enter);

    function Start() {
        ViewMngr.SetActiveCamera(scene.rootObj.camera);        
        ViewMngr.activeCam.trfmAxes.SetPosAxes(2.0, 3.0, 15.0);
        playerObj.trfmLocal.SetPosAxes(10.0, 5.0, -5.0);
        GUINetwork.SetActive(hud.name, true);
        angle = 0.01;
        waveringValue = 0.0;
        Input.SetActive(ctrlSchemeName, true);
    }

    function Update() {
        waveringValue += 0.01;

        playerObj.trfmLocal.Rotate(VEC3_RIGHT, angle * 20.0);
        playerObj.trfmLocal.ScaleAxes(Math.sin(waveringValue)  / 100, Math.sin(waveringValue) / 100, 0.0);

        testCube.trfmLocal.ScaleAxes(Math.sin(waveringValue)  / 100, Math.sin(waveringValue) / 100, Math.sin(waveringValue) / 100);

        timer += Time.deltaMilli;
        aquaMsg.UpdateMsg(timer.toString());

        if(resetBtn.pressed) {
            resetBtn.Release();
            SceneMngr.SetActive("Physics Testbed");
        }
    }

    function End() {
        playerObj.trfmLocal.SetPosAxes(0.0, 1.0, -5.0);
        playerObj.trfmLocal.orient.SetIdentity();
        playerObj.trfmLocal.scale.SetOne();
        testCube.trfmLocal.scale.SetOne();
        arrow.trfmLocal.SetPosAxes(-0.5, 1.0, -2.5);
        heart.trfmLocal.SetPosVec3(new Vector3(3.5, 0.5, -1.0));

        GUINetwork.SetActive(hud.name, false);
        timer = 0.0;
        Input.SetActive(ctrlSchemeName, false);
    }

    scene.Add(arrow);
    scene.Add(heart);
    scene.Add(testCube);
    scene.Add(cube);
    scene.SetCallbacks(Start, Update, End);
}