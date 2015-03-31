/**
 * Created by Devin on 2015-03-30.
 */

function LevelCompleteMessage() {

    var msgSysName = "Level complete message";
    var msgSys = new GUISystem(new WndRect(ViewMngr.wndWidth/2 - 200, ViewMngr.wndHeight/2 - 300, 400, 600), msgSysName );
    var contW = msgSys.sysRect.w;
    var labelH = 40
    GUINetwork.AddSystem(msgSys, false);

    var style = new MsgBoxStyle();
    style.bgColour.SetValues(0.9, 0.6, 0.3);
    style.bgAlpha = 1.0;
    msgSys.AddTextObject("backdrop", new GUITextObject(new WndRect(0, 0, msgSys.sysRect.w, msgSys.sysRect.h), "", style));

    style.margin = 5.0;
    style.fontSize = 40;
    style.fontColour.SetValues(1.0, 1.0, 1.0);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.bgAlpha = 0.0;
    style.bold = true;
    msgSys.AddTextObject("header", new GUITextObject(new WndRect(20, 20, contW - 40, 50), "LEVEL CLEAR!", style));

    style.fontSize = 24;
    style.fontColour.SetValues(0.0, 0.0, 0.0);
    style.bgColour.SetValues(1.0, 1.0, 1.0);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.bgAlpha = 1.0;
    style.bold = false;
    msgSys.AddTextObject("Cows saved", new GUITextObject(new WndRect(20, 90, contW - 40, 34), "Total Cows Saved: 00", style));

    this.UpdateInfo = function() {
        msgSys.guiTextObjs["Cows saved"].UpdateMsg("Total Cows Saved: " + GameUtils.GetCowsSavedTotal());
    };
    this.SetActive = function(beActive) {
        if(beActive) {
            if(!GUINetwork.CheckActive(msgSysName)) {
                // Activate
                GUINetwork.SetActive(msgSysName, beActive);
            }
            this.UpdateInfo();
        }
        else {
            if(GUINetwork.CheckActive(msgSysName)) {
                // Deactivate
                GUINetwork.SetActive(msgSysName, beActive);
            }
        }
    };
}