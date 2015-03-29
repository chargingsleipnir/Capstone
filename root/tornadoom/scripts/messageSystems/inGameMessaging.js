/**
 * Created by Devin on 2015-03-29.
 */

var InGameMsgr = (function() {
    var msgBoard = new GUISystem(new WndRect(ViewMngr.wndWidth/2 - 200, ViewMngr.wndHeight/2 - 100, 400, 200), "Message Board");
    GUINetwork.AddSystem(msgBoard, false);

    var style = new MsgBoxStyle();
    style.fontSize = 20;
    style.fontColour = new Vector3(0.0, 0.0, 0.0);
    style.textMaxWidth = 200;
    style.textAlignWidth = Alignment.centre;
    style.textAlignHeight = Alignment.centre;
    style.bgAlpha = 0.0;
    style.fontAlpha = 0.0;
    style.bgColour = new Vector3(0.0, 0.0, 0.0);
    style.margin = 15.0;
    style.bgTextures = [GameMngr.assets.textures['cowBorderEnter']];

    var msgRect = new WndRect(0, 0, 400, 200);

    var msgSequences = {};
    var currSqncName = "";
    var iterator = 0;

    return {
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
            msgSequences[currSqncName][iterator].SetActive(false);
            iterator++;
            msgSequences[currSqncName][iterator].SetActive(true);
        },
        DispMsg: function() {
            msgSequences[currSqncName][iterator].FadeBackground(0.05);
            msgSequences[currSqncName][iterator].FadeMsg(0.05);
        }
    };
})();