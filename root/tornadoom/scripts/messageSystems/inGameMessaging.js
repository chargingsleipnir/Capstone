/**
 * Created by Devin on 2015-03-29.
 */

var InGameMsgr = (function() {
    var msgSequences = {};
    var currSqncName = "";
    var iterator = 0;
    var msgFadeStart = 0.25;
    var msgFadeRate = 0.025;

    var msgBoard = null;
    var style = new MsgBoxStyle();
    style.fontSize = 20;
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.bgAlpha = msgFadeStart;
    style.fontAlpha = msgFadeStart;
    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.margin = 15.0;
    var msgRect = new WndRect(0, 0, 400, 200);

    return {
        Initialize: function() {
            msgBoard = new GUISystem(new WndRect(ViewMngr.wndWidth/2 - 200, ViewMngr.wndHeight/2 - 100, 400, 200), "Message Board");
            GUINetwork.AddSystem(msgBoard, false);

            style.bgTextures = [GameMngr.assets.textures['cowBorderEnter']];
        },
        SetActive: function(beActive) {
            GUINetwork.SetActive(msgBoard.name, beActive);
        },
        AddMsgSequence: function(name, msgArray) {
            currSqncName = name;
            msgSequences[name] = [];
            for(var i = 0; i < msgArray.length; i++) {
                msgSequences[name].push(new GUITextObject(msgRect, msgArray[i], style));
                msgBoard.AddTextObject(name + "msg" + i, msgSequences[name][i]);
                msgSequences[name][i].SetActive(false);
            }
        },
        ChangeMsgSequence: function(name) {
            currSqncName = name;
            iterator = 0;
        },
        NextMsg: function() {
            msgSequences[currSqncName][iterator].SetObjectFade(msgFadeStart);
            msgSequences[currSqncName][iterator].SetActive(false);
            iterator++;
            return iterator;
        },
        DispMsg: function() {
            msgSequences[currSqncName][iterator].SetActive(true);
            msgSequences[currSqncName][iterator].SetObjectFade(1.0);
            return iterator;
        },
        FadeMsgsWithinLimit: function(idxLimit) {
            if(iterator >= idxLimit)
                return false;

            msgSequences[currSqncName][iterator].SetActive(true);
            msgSequences[currSqncName][iterator].FadeBackground(msgFadeRate);
            msgSequences[currSqncName][iterator].FadeMsg(msgFadeRate);
            return true;
        }
    };
})();