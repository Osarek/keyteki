const _ = require('underscore');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');
const MulliganPrompt = require('./mulliganprompt.js');
const AdaptiveDeckSelectionPrompt = require('./AdaptiveDeckSelectionPrompt');
const FirstPlayerSelection = require('./FirstPlayerSelection');
const GameStartPrompt = require('./GameStartPrompt');
const Effects = require('../../effects.js');
const logger = require('../../../log.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new AdaptiveDeckSelectionPrompt(game),
            new FirstPlayerSelection(game),
            new SimpleStep(game, () => this.setupBegin()),
            new GameStartPrompt(game),
            new SimpleStep(game, () => this.drawStartingHands()),
            new SimpleStep(game, () => this.firstPlayerEffects()),
            new MulliganPrompt(game),
            new SimpleStep(game, () => this.startGame())
        ]);
    }

    startPhase() {
        this.game.currentPhase = this.name;
        for (let step of this.steps) {
            this.game.queueStep(step);
        }

        for (const player of this.game.getPlayers()) {
            if (player.deckData.isAlliance) {
                logger.info(JSON.stringify(player.deckData));
                let link1 = {
                    link:
                        'https://www.keyforgegame.com/deck-details/' +
                        player.deckData.allianceUuidDeck1,
                    argType: 'link',
                    label: player.deckData.allianceNameDeck1
                };
                let link2 = {
                    link:
                        'https://www.keyforgegame.com/deck-details/' +
                        player.deckData.allianceUuidDeck2,
                    argType: 'link',
                    label: player.deckData.allianceNameDeck2
                };
                let link3 = {
                    link:
                        'https://www.keyforgegame.com/deck-details/' +
                        player.deckData.allianceUuidDeck3,
                    argType: 'link',
                    label: player.deckData.allianceNameDeck3
                };
                if (this.game.gameFormat !== 'sealed' && !this.game.hideDeckLists) {
                    this.game.addMessage(
                        '{0} brings {1}{2} to The Crucible ',
                        player,
                        player.deckData.name,
                        player.chains > 0 ? ` with ${player.chains} chains` : ''
                    );

                    this.game.addMessage(
                        'Alliance of {0} {1} and {2} from Archons',
                        player.deckData.allianceHouseNameDeck1,
                        player.deckData.allianceHouseNameDeck2,
                        player.deckData.allianceHouseNameDeck3
                    );

                    this.game.addMessage('{0}', link1);
                    this.game.addMessage('{0}', link2);
                    this.game.addMessage('{0}', link3);
                }
            } else {
                let link = {
                    link: 'https://www.keyforgegame.com/deck-details/' + player.deckData.uuid,
                    argType: 'link',
                    label: player.deckData.name
                };
                if (this.game.gameFormat !== 'sealed' && !this.game.hideDeckLists) {
                    this.game.addMessage(
                        '{0} brings {1}{2} to The Crucible',
                        player,
                        link,
                        player.chains > 0 ? ` with ${player.chains} chains` : ''
                    );
                }
            }
        }
    }

    setupBegin() {
        for (let card of this.game.allCards) {
            card.applyAnyLocationPersistentEffects();
        }
    }

    firstPlayerEffects() {
        this.game.actions
            .draw({ amount: 1 })
            .resolve(this.game.activePlayer, this.game.getFrameworkContext());
        this.game.actions
            .forRemainderOfTurn({
                condition: () =>
                    !!this.game.cardsUsed.length ||
                    !!this.game.cardsPlayed.length ||
                    !!this.game.cardsDiscarded.length,
                effect: Effects.noActiveHouseForPlay()
            })
            .resolve(this.game.activePlayer, this.game.getFrameworkContext(this.game.activePlayer));
    }

    drawStartingHands() {
        _.each(this.game.getPlayers(), (player) => {
            this.game.actions.shuffleDeck().resolve(player, this.game.getFrameworkContext());
            this.game.actions
                .draw({ refill: true })
                .resolve(player, this.game.getFrameworkContext());
        });
        this.game.startingHandsDrawn = true;
    }

    startGame() {
        _.each(this.game.getPlayers(), (player) => {
            player.readyToStart = true;
        });
        this.game.raiseEvent('onGameStarted');
    }
}

module.exports = SetupPhase;
