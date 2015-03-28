/**
 * Created by Devin on 2015-03-08.
 */

function InGameMenu(gameMouse, player, ResetCallback) {

    var that = this;
    var pages = { main: 0, devContol: 1 };
    var ActivePageUpdate; // Function holder

    var camToggle = true;
    var menuToggle = false;
    var menuSysName = "Main Menu";
    var mainMenu = new GUISystem(new WndRect(ViewMngr.wndWidth/2 - 200, ViewMngr.wndHeight/2 - 300, 400, 600), menuSysName );

    // System to add a diode to anything I want to use as a switch ----------------
    var diodeStyle = new MsgBoxStyle();
    diodeStyle.bgTextures = [
        GameMngr.assets.textures['switchUnlit'],
        GameMngr.assets.textures['switchLit']
    ];
    function AttachDiodeAtEnd(rect, diodesObj, name, margin) {
        var diam = rect.h - margin * 2;
        diodesObj[name] = new GUITextObject(new WndRect(rect.x + rect.w - margin - diam, rect.y + margin, diam, diam), "", diodeStyle);
    }
    // -----------------------------------------------------------------------------

    var style = new MsgBoxStyle();
    style.bgColour = new Vector3(0.1, 0.1, 0.1);
    style.bgAlpha = 0.9;

    var backDrop = new GUITextObject(new WndRect(0, 0, mainMenu.sysRect.w, mainMenu.sysRect.h), "", style);

    style.bgColour.SetValues(0.8, 0.5, 0.2);
    style.margin = 5.0;
    style.fontSize = 30;
    style.fontColour.SetValues(0.0, 0.0, 0.0);
    style.fontHoverColour.SetValues(0.1, 0.1, 0.1);
    style.bgHoverColour.SetValues(0.9, 0.6, 0.3);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.fontAlpha = 1.0;
    style.bold = false;

    // FIRST PAGE MENU BUTTONS ---------------------------
    var contW = backDrop.rectGlobal.w;
    var contH = backDrop.rectGlobal.h;
    var btnH = 50;
    var mainPageObjs = [
        new GUITextObject(new WndRect(20, 20, contW - 40, btnH), "Resume Game", style),
        new GUITextObject(new WndRect(20, 90, contW - 40, btnH), "Quit Game", style),
        new GUITextObject(new WndRect(20, 160, contW - 40, btnH), "Developer Tools", style)
    ];

    // Callbacks
    function ResumeCallback() {
        gameMouse.LeftRelease();
        that.ToggleActive();
        GameMngr.assets.sounds['tick'].play();
    }
    function QuitCallback() {
        gameMouse.LeftRelease();
        that.ToggleActive();
        GameMngr.assets.sounds['tick'].play();
        ResetCallback();
    }
    function ToDevPageCallback() {
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
        ActivatePage(pages.devContol);
    }

    // DEV CONTROL PAGE ---------------------------

    var devPageObjs = [];
    var devPageDiodes = {};

    // Back button
    devPageObjs.push(new GUITextObject( new WndRect(contW - 120, contH - 70, 100, btnH), "Back", style ));

    // Create all of the switches
    style.textAlignWidth = Alignment.left;
    style.fontSize = 20;
    style.bold = true;
    var smallBtnW = (contW - 50) / 2;
    var devPageSwitches = [
        new GUITextObject(new WndRect(20, 20, contW - 40, btnH - 10), "Free camera", style ),
        new GUITextObject(new WndRect(20, 150, smallBtnW, btnH - 10), "Obj Axes", style ),
        new GUITextObject(new WndRect(20, 200, smallBtnW, btnH - 10), "Spheres", style ),
        new GUITextObject(new WndRect(20, 250, smallBtnW, btnH - 10), "Capsules", style ),
        new GUITextObject(new WndRect(20, 300, smallBtnW, btnH - 10), "Donuts", style ),
        new GUITextObject(new WndRect(20, 350, smallBtnW, btnH - 10), "Boxes", style ),
        new GUITextObject(new WndRect(20, 400, smallBtnW, btnH - 10), "Vel Rays", style ),
        new GUITextObject(new WndRect(contW - smallBtnW - 20, 150, smallBtnW, btnH - 10), "World Axes", style ),
        new GUITextObject(new WndRect(contW - smallBtnW - 20, 200, smallBtnW, btnH - 10), "Grid", style ),
        new GUITextObject(new WndRect(contW - smallBtnW - 20, 250, smallBtnW, btnH - 10), "Game Data", style )
    ];
    // Add a diode to each switch
    var switchNames = [
        'freeCam',
        'orientAxes',
        'collSpheres',
        'collCapsules',
        'collDonuts',
        'collBoxes',
        'velRays',
        'worldAxes',
        'grid',
        'gameData'
    ];
    for(var i = 0; i < devPageSwitches.length; i++)
        AttachDiodeAtEnd(devPageSwitches[i].rectGlobal, devPageDiodes, switchNames[i], 5);
    // Add them to the list of page objects
    devPageObjs = devPageObjs.concat(devPageSwitches);
    // Add all diodes belonging to this page
    for(var i in devPageDiodes)
        devPageObjs.push(devPageDiodes[i]);

    // Header to debug visual switches
    style.fontSize = 30;
    style.bgAlpha = 0.0;
    style.bold = true;
    style.fontColour.SetValues(0.8, 0.8, 0.8);
    style.bgTextures = [];
    devPageObjs.push(new GUITextObject( new WndRect(20, 80, contW - 40, btnH), "Debug Visuals", style ));

    // Callbacks
    function ToMainPageCallback() {
        ActivatePage(pages.main);
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
    }
    function CamChangeCallback() {
        // CONTROL SHIFTED TO SEPARATE CAMERA
        camToggle = !camToggle;
        if(camToggle) {
            player.ctrl.SetActive(true);
            ViewMngr.SetActiveCamera(player.obj.camera);
            devPageDiodes['freeCam'].UseTexture(0);
        }
        else {
            player.ctrl.SetActive(false);
            ViewMngr.SetActiveCamera();
            devPageDiodes['freeCam'].UseTexture(1);
        }
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
    }
    function DispOrientAxesCallback() {
        DebugMngr.dispOrientAxes = !DebugMngr.dispOrientAxes;
        DebugMngr.dispOrientAxes ? devPageDiodes['orientAxes'].UseTexture(1) : devPageDiodes['orientAxes'].UseTexture(0);
        MenuDebugUpdate();
    }
    function DispCollSpheresCallback() {
        DebugMngr.dispSpheres = !DebugMngr.dispSpheres;
        DebugMngr.dispSpheres ? devPageDiodes['collSpheres'].UseTexture(1) : devPageDiodes['collSpheres'].UseTexture(0);
        MenuDebugUpdate();
    }
    function DispCollCapsulesCallback() {
        DebugMngr.dispCapsules = !DebugMngr.dispCapsules;
        DebugMngr.dispCapsules ? devPageDiodes['collCapsules'].UseTexture(1) : devPageDiodes['collCapsules'].UseTexture(0);
        MenuDebugUpdate();
    }
    function DispCollDonutsCallback() {
        DebugMngr.dispDonuts = !DebugMngr.dispDonuts;
        DebugMngr.dispDonuts ? devPageDiodes['collDonuts'].UseTexture(1) : devPageDiodes['collDonuts'].UseTexture(0);
        MenuDebugUpdate();
    }
    function DispCollBoxesCallback() {
        DebugMngr.dispBoxes = !DebugMngr.dispBoxes;
        DebugMngr.dispBoxes ? devPageDiodes['collBoxes'].UseTexture(1) : devPageDiodes['collBoxes'].UseTexture(0);
        MenuDebugUpdate();
    }
    function DispVelocityRaysCallback() {
        DebugMngr.dispRays = !DebugMngr.dispRays;
        DebugMngr.dispRays ? devPageDiodes['velRays'].UseTexture(1) : devPageDiodes['velRays'].UseTexture(0);
        MenuDebugUpdate();
    }
    function DispWorldAxesCallback() {
        DebugMngr.dispAxes = !DebugMngr.dispAxes;
        DebugMngr.dispAxes ? devPageDiodes['worldAxes'].UseTexture(1) : devPageDiodes['worldAxes'].UseTexture(0);
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
    }
    function DispGridCallback() {
        DebugMngr.dispGrid = !DebugMngr.dispGrid;
        DebugMngr.dispGrid ? devPageDiodes['grid'].UseTexture(1) : devPageDiodes['grid'].UseTexture(0);
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
    }
    function DispGameDataCallback() {
        DebugMngr.dispInfo = !DebugMngr.dispInfo;
        DebugMngr.dispInfo ? devPageDiodes['gameData'].UseTexture(1) : devPageDiodes['gameData'].UseTexture(0);
        GUINetwork.SetActive("Performance Data", DebugMngr.dispInfo);
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
    }
    // Not a callback, helper function
    function MenuDebugUpdate() {
        var scene = SceneMngr.GetActiveScene();
        scene.debug.UpdateActiveDispObjs();
        gameMouse.LeftRelease();
        GameMngr.assets.sounds['tick'].play();
    }


    // ADD GUI OBJS TO WHOLE MENU ---------------------------
    mainMenu.AddTextObject("backdrop", backDrop);
    for(var i = 0; i < mainPageObjs.length; i++)
        mainMenu.AddTextObject("mainPageObj" + i, mainPageObjs[i]);
    for(var i = 0; i < devPageObjs.length; i++) {
        mainMenu.AddTextObject("devPageObj" + i, devPageObjs[i]);
    }
    // Add to game's GUI network
    GUINetwork.AddSystem(mainMenu, false);

    function UpdatePageMain() {
        mainPageObjs[0].AsButton(gameMouse.pos, gameMouse.leftPressed, ResumeCallback);
        mainPageObjs[1].AsButton(gameMouse.pos, gameMouse.leftPressed, QuitCallback);
        mainPageObjs[2].AsButton(gameMouse.pos, gameMouse.leftPressed, ToDevPageCallback);
    }
    function UpdatePageDevControl() {
        devPageObjs[0].AsButton(gameMouse.pos, gameMouse.leftPressed, ToMainPageCallback);
        devPageObjs[1].AsButton(gameMouse.pos, gameMouse.leftPressed, CamChangeCallback);
        devPageObjs[2].AsButton(gameMouse.pos, gameMouse.leftPressed, DispOrientAxesCallback);
        devPageObjs[3].AsButton(gameMouse.pos, gameMouse.leftPressed, DispCollSpheresCallback);
        devPageObjs[4].AsButton(gameMouse.pos, gameMouse.leftPressed, DispCollCapsulesCallback);
        devPageObjs[5].AsButton(gameMouse.pos, gameMouse.leftPressed, DispCollDonutsCallback);
        devPageObjs[6].AsButton(gameMouse.pos, gameMouse.leftPressed, DispCollBoxesCallback);
        devPageObjs[7].AsButton(gameMouse.pos, gameMouse.leftPressed, DispVelocityRaysCallback);
        devPageObjs[8].AsButton(gameMouse.pos, gameMouse.leftPressed, DispWorldAxesCallback);
        devPageObjs[9].AsButton(gameMouse.pos, gameMouse.leftPressed, DispGridCallback);
        devPageObjs[10].AsButton(gameMouse.pos, gameMouse.leftPressed, DispGameDataCallback);
    }

    function ActivatePage(page) {
        for(var i in mainMenu.guiTextObjs)
            mainMenu.guiTextObjs[i].SetActive(false);

        backDrop.SetActive(true);

        switch(page) {
            case pages.main:
                for(var i = 0; i < mainPageObjs.length; i++)
                    mainPageObjs[i].SetActive(true);
                ActivePageUpdate = UpdatePageMain;
                break;
            case pages.devContol:
                for(var i = 0; i < devPageObjs.length; i++)
                    devPageObjs[i].SetActive(true);
                ActivePageUpdate = UpdatePageDevControl;
                break;
        }
    }
    ActivatePage(pages.main);

    this.ToggleActive = function() {
        menuToggle = !menuToggle;
        GUINetwork.SetActive(menuSysName, menuToggle);
        ActivatePage(pages.main);
        GameMngr.TogglePause();
        if (menuToggle) gameMouse.SetCursor(CursorTypes.normal);
        else gameMouse.SetCursor(CursorTypes.none);
    };
    this.Update = function() {
        if(GUINetwork.CheckActive(menuSysName))
            ActivePageUpdate();
    };
}