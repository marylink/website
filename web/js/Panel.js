var Panel = function(node, initParams) {
	this.initParams = initParams;
	this.$subPanels = {};
	this.$activeSubpanel;

	var that = this;
    var userRole = "user"; //editor, anonymous

    $("#panel").height($("#kinetic").height() - $("#footer").height() - 30);

	$.ajax({
      url: baseUrl + "panel/getPanel/" + node.id + "/",
    }).done(function(content) {

    	$("#panel").empty().append(content);
    	$("#panel .panel-content").each(function (index, subPanel) {
            // debugger;
            subPanelId = $(subPanel).attr("id");
    		that.$subPanels[subPanelId] = $(subPanel);
            that.initSubPanel(subPanel);
            that.loadSubPanelEvents(subPanel, userRole);
    	});

        camera.panelOffset = $("#panel").width();

    	$("#panel").show("slide", {
    		direction: "right",
    		complete: function () {
                that.$activeSubpanel = that.$subPanels["first-panel"];
                that.initParams.onComplete();
                that.setOrUpdateScrollbar();
            }
    	});
	});

	this.close = function(params) {
        that.closePanelModal();
		$("#panel").hide("slide", {
			direction: "right", 
			complete: function() {
                that.$activeSubpanel.hide();
                params.onComplete();
                camera.panelOffset = 0;
            }
		});
	}

    this.showErrors = function(response){
        var content = "<h3>Oops !</h3><br />";
        content += response.message + "<br />";
        for (var key in response.data) {
            if (response.data.hasOwnProperty(key)) {
                content += response.data[key] + '<br />';
            }
        }
        content += '<button class="panelModalRemoveBtn">OK</button>';

        that.addPanelModal(content);        
    }

    this.showMessage = function(content){
        this.$activeSubpanel.find(".message-zone").html(content).css("display", "inline-block");
        window.setTimeout(function(){
            $(".message-zone").fadeOut("fast");
        }, 3000);
    }

    this.addPanelModal = function(html){
        var panelModal = $('<div class="panelModal">');
        panelModal.html(html).hide();
        panelModal.css({
            width: $("#panel").width(),
            height: $("#panel").height()
        });
        $("#panel").append(panelModal);
        panelModal.fadeIn(200);
        $(".panelModalRemoveBtn").on("tap click", function(e){
            e.preventDefault();
            that.closePanelModal();
        });
    }

    this.closePanelModal = function(){
        $(".panelModal").remove();
    }

	this.loadSubPanelEvents = function(subPanel, userRole) {
        var subPanelId = $(subPanel).attr("id");
        switch (subPanelId) {
            case "first-panel":
                $(subPanel).children("a.panel-btn").each(function (loadBtnIndex, loadBtn) {
                    $(loadBtn).on("tap click", function() {
                        var panelToLoad = $(loadBtn).data("panel");

                        //Hide first-panel's scrollbar so it doesn't conflict with subPanel's scrollbar
                        that.$activeSubpanel.find(".scrollbar").css("display", "none");

                        that.$activeSubpanel = $("#" + panelToLoad);
                        $("#" + panelToLoad).show("slide", {
                            direction: "right",
                        }, function(){
                            that.panelLoadEvents();
                            
                            that.setOrUpdateScrollbar();

                            if ($("body").hasClass("anonymous") && panelToLoad != "share-skill-panel"){
                                that.addPanelModal(
                                    '<div class="please-sign-in">You have to be signed in to do that !<br /><br />' + 
                                    '<a class="login-link" href="../login/">Sign in !</a><br />or<br /> ' + 
                                    '<a class="register-link" href="../register/">Create an account !</a>' + '</div>'
                                );
                            }
                        });

                        return false;
                    });
                })
                break;
            case "create-skill-panel":
                $(subPanel).find(".img-btn").on("tap click", function() {
                    $(subPanel).find("#creationType").val($(this).data("value"));
                    $(subPanel).find("#skillParentUuid").val($(this).data("parentuuid"));
                    $(subPanel).find(".img-btn").toggleClass("selected");
                });

                $("#create-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#create-skill-form").attr("action"),
                        type: $("#create-skill-form").attr("method"),
                        data: $("#create-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                $("#create-skillName").val("");
                                that.showMessage(response.message);
                                
                                var creationType = $(subPanel).find("#creationType").val();
                                if (creationType == "child") {
                                    tree.editedNode.createNewChild(response.data);
                                } else if (creationType == "parent") { 
                                    $("#creationTypeParent").data("parentuuid", response.data.uuid);
                                    $("#skillParentUuid").val(response.data.uuid);
                                    tree.editedNode.createNewParent(response.data)
                                }
                            }
                            else {
                                that.showErrors(response);
                            }
                        }
                    });
                });
                break;
            case "move-skill-panel":
                $(subPanel).find(".img-btn").on("tap click", function() {
                    $(subPanel).find("#moveType").val($(this).data("value"));
                    $(subPanel).find("#move-form-submit").val($(this).data("value").toUpperCase());
                    $(subPanel).find(".selected").toggleClass("selected");
                    $(this).toggleClass("selected");

                    $(subPanel).find("#move-step2").css("display", "block");
                    tree.enterTargetMode();
                });

                $("#move-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#move-skill-form").attr("action"),
                        type: $("#move-skill-form").attr("method"),
                        data: $("#move-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                that.showMessage(response.message);
                                tree.executeMoveCopy();
                            }
                            else {
                                that.showErrors(response);
                            }
                        }
                    });
                });
                break;
            case "rename-skill-panel":
                $("#rename-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#rename-skill-form").attr("action"),
                        type: $("#rename-skill-form").attr("method"),
                        data: $("#rename-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                $("#rename-skillName").val("");
                                $("#panel .skillName").html('"'+response.data.name+'"'); //change the skillname at top of panel
                                that.showMessage(response.message);
                                tree.editedNode.setName(response.data.name);
                            }
                            else {
                                that.showErrors(response);
                            }
                        }
                    });
                });
                break;
            case "delete-skill-panel":
                $("#delete-skill-form-submit").hide();
                $(subPanel).find(".sureToDeleteRadio").on("change", function(e){
                    $("#delete-skill-form-submit").toggle();
                });
                $("#delete-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#delete-skill-form").attr("action"),
                        type: $("#delete-skill-form").attr("method"),
                        data: $("#delete-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok") {
                                var nodeToDelete = tree.editedNode;
                                nodeToDelete.finishEdit(); //close the panel, nothing to do here anymore    
                                nodeToDelete.deleteFromDB();
                                that.showMessage(response.message);
                            }
                            else {
                                that.showErrors(response);
                            }
                        }
                    });
                });
                break;
            case "translate-skill-panel":                
                $("#translate-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#translate-skill-form").attr("action"),
                        type: $("#translate-skill-form").attr("method"),
                        data: $("#translate-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                $.ajax({
                                    url: baseUrl + "panel/reloadTranslations/" + node.id,
                                    success: function(messagesHtml){
                                        that.showMessage(response.message);
                                        $("#other-translations-list").html(messagesHtml);
                                    }
                                });
                            }
                            else {
                                that.showErrors(response);
                            }
                        }
                    });
                });
                break;
            case "discuss-skill-panel":
                $("#discuss-skill-form").on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $("#discuss-skill-form").attr("action"),
                        type: $("#discuss-skill-form").attr("method"),
                        data: $("#discuss-skill-form").serialize(),
                        success: function(response){
                            if (response.status == "ok"){
                                $("#discuss-message").val("");
                                $.ajax({
                                    url: baseUrl + "panel/reloadDiscussionMessages/" + node.id + "/",
                                    success: function(messagesHtml){
                                        $(".discuss-prev-messages").html(messagesHtml);
                                    }
                                });
                            }
                            else {
                                that.showErrors(response);
                            }
                        }
                    });
                });
                break;
            case "share-skill-panel":
                $("#skill-permalink-input").on("tap click", function () {
                   $(this).select();
                });
                break;
        }

        //Common events
        $(subPanel).find(".back-to-panel-btn").on("tap click", function() {
            $(subPanel).hide("slide", {
                direction:"right",
                complete: function() {
                    //Show first-panel's scrollbar
                    that.$subPanels["first-panel"].find(".scrollbar").css("display", "block");
                }
            });
            that.$activeSubpanel = that.$subPanels["first-panel"];

            if (tree.targetMode = true) tree.exitTargetMode();
            return false;
        });

        $(subPanel).find(".close-panel-btn").on("tap click", function() {
            if (tour.isActive == true || doTour == true) tour.actionOnTree("close-panel");

            if (tree.targetMode = true) tree.exitTargetMode();
            tree.editedNode.finishEdit();
            return false;
        });

        // Click/tap on the stage only fires on nodes, not on empty space (TODO)
        // stage.on("click tap", function(e) {
        //     tree.editedNode.finishEdit();
        //     stage.off("click tap");
        // });
	}

    this.initSubPanel = function(subPanel) {
        var subPanelId = $(subPanel).attr("id");
        $(subPanel)
            .css({
                position: "absolute",
                width: $("#panel").width() 
            });
        if (subPanelId != "first-panel") $(subPanel).hide();
    }
}

Panel.prototype.panelLoadEvents = function() {
    var panel = tree.editedNode.panel;

    switch (panel.$activeSubpanel[0].id) {
        case "move-skill-panel":
            //Nothing to do for now, but who knows...
            break;
    }
}


Panel.prototype.setOrUpdateScrollbar = function() {

    if (typeof this.$activeSubpanel[0].scrollBarLoaded == "undefined") {
        this.$activeSubpanel.wrapInner("<div class='viewport'><div class='overview'></div></div>");
        this.$activeSubpanel.find(".viewport").before("<div class='scrollbar'><div class='track'><div class='thumb'><div class='end'></div></div></div></div>");
    }

    this.$activeSubpanel.find(".viewport").css({
        width: this.$activeSubpanel.width(),
        height: $("#panel").height()
    });

    this.$activeSubpanel.find(".overview").css({ 
        width: this.$activeSubpanel.width()
    });

    if (this.$activeSubpanel[0].scrollBarLoaded == true) this.$activeSubpanel.data("plugin_tinyscrollbar").update();
    else this.$activeSubpanel.tinyscrollbar();

    this.$activeSubpanel[0].scrollBarLoaded = true;
}