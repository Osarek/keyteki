const DrawCard = require('../../drawcard.js');

class Misinformation extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give opponent\'s participating cards -1/-1',
            condition: () => this.game.currentConflict && this.controller.opponent && this.controller.showBid > this.controller.opponent.showBid + 1 && 
                             this.controller.opponent.anyCardsInPlay(card => isParticipating()),
            handler: () => {
                this.game.addMessage('{0} plays {1}, giving all {2}\'s participating characters -1/-1', this.controller, this, this.controller.opponent);
                this.controller.opponent.cardsInPlay.each(card => {
                    if(card.isParticipating()) {
                        card.untilEndOfConflict(ability => ({
                            match: card,
                            effect: [
                                ability.effects.modifyMilitarySkill(-1),
                                ability.effects.modifyPoliticalSkill(-1)
                            ]
                        }));
                    }
                });
            }
        });
    }
}

Misinformation.id = 'misinformation'; // This is a guess at what the id might be - please check it!!!

module.exports = Misinformation;
