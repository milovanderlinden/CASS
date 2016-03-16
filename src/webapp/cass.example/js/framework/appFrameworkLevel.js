function populateFrameworkLevels(frameworkId) {
    EcRepository.get(frameworkId, function (fw) {
        $("[url='" + frameworkId + "']").find(".cass-competency-levels").html("");
        if (fw.level !== undefined) {
            for (var i = 0; i < fw.level.length; i++) {
                EcRepository.get(fw.level[i], function (level) {
                    var ui = $("[url='" + frameworkId + "']").find("[url='" + level.competency + "']");
                    ui.find(".cass-competency-levels").append(cassLevelTemplate);
                    ui = ui.find(".cass-competency-levels").children().last();
                    ui.attr("url", level.shortId());
                    ui.find(".cass-level-name").text(level.name);
                    ui.find(".cass-level-title").text(level.title);
                    ui.find(".cass-level-description").text(level.description);
                    ui.find(".cass-level-actions").prepend("<a class='canEditLevel' onclick='removeLevelFromFrameworkButton(this);' style='display:none;'>Remove</a>");
                    ui.find(".cass-level-actions").prepend("<a class='canEditLevel' onclick='editLevelButton(this);' style='display:none;'>Edit</a>");
                    if (level.canEdit(identity.ppk.toPk()))
                        ui.find(".canEditLevel").show();
                    else
                        ui.find(".canEditLevel").hide();
                    if (fw.canEdit(identity.ppk.toPk()))
                        ui.find(".canEditFramework").show();
                    else
                        ui.find(".canEditFramework").hide();
                }, error);
            }
        }
    });
}

function insertExistingLevelIntoFramework(me) {
    var levelId = $(me).parent(".cass-competency-level").attr("url");
    var frameworkId = $("#frameworks").find(".is-active").attr("url");

    insertLevelIntoFramework(levelId, frameworkId);
}

function insertLevelIntoFramework(levelId, frameworkId) {
    if (levelId == null) {
        error("Level not selected.");
        return;
    }
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        var f = new EcFramework();
        f.copyFrom(framework);
        f.addLevel(levelId);
        EcRepository.save(f, function () {
            populateFrameworkLevels(frameworkId);
        }, error);
    }, error);
}


function removeLevelFromFrameworkButton(me) {
    var levelId = $(me).parents(".cass-competency-level").attr("url");
    var frameworkId = $("#frameworks").find(".is-active").attr("url");

    removeLevelFromFramework(levelId, frameworkId);
}

function removeLevelFromFramework(levelId, frameworkId) {
    if (levelId == null) {
        error("Level not selected.");
        return;
    }
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        var f = new EcFramework();
        f.copyFrom(framework);
        f.removeLevel(levelId);
        EcRepository.save(f, function () {
            populateFrameworkLevels(frameworkId);
        }, error);
    }, error);
}