$(document).ready(function () {
    var character = {
        "Boba Fett": {
            name: "Boba Fett",
            health: 120,
            attack: 8,
            imageURL: "assets/images/Boba Fett.jpg",
            enemyAttackBack: 15
        },
        "Bossk": {
            name: "Bossk",
            health: 100,
            attack: 14,
            imageURL: "assets/images/Bossk.jpg",
            enemyAttackBack: 5
        },
        "Dengar": {
            name: "Dengar",
            health: 150,
            attack: 8,
            imageURL: "assets/images/Dengar.jpg",
            enemyAttackBack: 5
        },
        "IG-88": {
            name: "IG-88",
            health: 180,
            attack: 7,
            imageURL: "assets/images/Droid.jpg",
            enemyAttackBack: 25
        }
    };

    var currSelectedCharacter = 0;
    var combatants = [];
    var currDefender = 0;
    var turnCounter = 0;
    var killCount = 0;

    console.log(character);
    var renderOne = function (character, renderArea, charStatus) {
        var charDiv = $("<div class = 'character' data-name='" + character.name + "'>");
        var charName = $("<div class = 'character-name'>").text(character.name);
        var charImage = $("<img alt= 'image' class = 'character-image'>").attr("src", character.imageURL);
        var charHealth = $("<div class = 'character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);

        if (charStatus === "enemy") {
            $(charDiv).addClass("enemy");

        }
        else if (charStatus === "#defender") {
            currDefender = character;
            $(charDiv).addClass("target-enemy");
        }
    }


    var renderMessage = function (message) {
        var gameMessageset = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageset.append(newMessage);

        if (message === "clearMessage") {
            gameMessageset.text("")
        }
    }
    var renderCharacters = function (charObj, areaRender) {
        if (areaRender === "#characters-section") {
            $(areaRender).empty();
            for (var key in charObj) {
                if (charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender, "");
                }
            }
        }
        if (areaRender === "#selected-character") {
            renderOne(charObj, areaRender, "");
        }
        if (areaRender === "#available-to-attack-section") {
            for (var i = 0; i < charObj.length; i++) {
                renderOne(charObj[i], areaRender, "enemy");
            }
            $(document).on("click", ".enemy", function () {
                var name = ($(this).attr("data-name"));
                if ($("#defender").children().length === 0) {
                    renderCharacters(name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            });
        }
        if (areaRender === "#defender") {
            $(areaRender).empty();
            for (var i = 0; i < combatants.length; i++) {
                if (combatants[i].name === charObj) {
                    renderOne(combatants[i], areaRender, "#defender")
                }
            }
        }
        if (areaRender === "playerDamage") {
            $("#defender").empty();
            renderOne(charObj, "#defender", "defender");
        }
        if (areaRender === "enemyDamage") {
            $("#selected-character").empty();
            renderOne(charObj, "#selected-character", "");
        }
        if (areaRender === "enemyDefeated") {
            $("#defender").empty();
            var gameStateMessage = "You have defeated" + charObj.name + ", please choose another enemy to fight";
            renderMessage(gameStateMessage);
        }
    };

    var resetGame = function (inputEndGame) {
        var restart = $("<button>Restart</button>").click(function () {
            location.reload();
        });
        var gameState = $("<div>").text(inputEndGame);
        $("body").append(gameState);
        $("body").append(restart);
    }
    renderCharacters(character, "#characters-section");

    $(document).on("click", ".character", function () {
        var name = $(this).attr("data-name");
        console.log(name);
        if (!currSelectedCharacter) {
            currSelectedCharacter = character[name];
            for (var key in character) {
                if (key !== name) {
                    combatants.push(character[key]);
                }
            }
            console.log(combatants);
            $("#characters-section").hide();
            renderCharacters(currSelectedCharacter, "#selected-character");
            renderCharacters(combatants, "#available-to-attack-section");

        }
    });

    $("#attack-button").on("click", function () {
        if ($("#defender").children().length !== 0) {
            var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack + turnCounter) + " damage";
            var counterAttackMessage = currDefender.name + " hit you, dealing " + currDefender.enemyAttackBack + " damage";
            renderMessage("clearMessage");
            currDefender.health -= (currSelectedCharacter.attack * turnCounter);

            if (currDefender.health > 0) {

                renderCharacters(currDefender, "playerDamage");
                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);
                currSelectedCharacter.health -= currDefender.enemyAttackBack;

                renderCharacters(currSelectedCharacter, "enemyDamage");
                
                if (currSelectedCharacter.health <= 0) {
                    renderMessage("clearMessage")
                    restartGame("You have been struck down. Game over.")
                    $("#attack-button").unbind("click");
                }
            }
            else {
                renderCharacters(currDefender, "#enemyDefeated");
                killCount++;
                if (killcount >= 3) {
                    renderMessage("clearMessage");
                    resetGame("You defeated them all! The force is strong with you!")
                }
            }
        }
        
        turnCounter++;

    });

});