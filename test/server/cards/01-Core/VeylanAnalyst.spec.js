describe('Veylan Analyst', function () {
    describe("Veylan Analyst's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'veylan-analyst',
                        'library-of-babble',
                        'shard-of-knowledge',
                        'archimedes',
                        'timetraveller',
                        'kartanoo'
                    ],
                    hand: ['fetchdrones']
                },
                player2: {
                    inPlay: ['lamindra', 'shard-of-greed']
                }
            });
        });

        it('should trigger when using an artifact', function () {
            this.player1.useAction(this.libraryOfBabble);
            expect(this.player1.amber).toBe(1);
        });

        it('should not trigger when opponent uses an artifact', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.useAction(this.shardOfGreed);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
        });

        it("should trigger when using opponent's artifact as if it were yours", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.reap(this.kartanoo);
            this.player1.clickCard(this.shardOfGreed);
            expect(this.player1.amber).toBe(4); // 1A from reaping, 1A from Veylan and 2A from Shard
            expect(this.player2.amber).toBe(0);
        });

        it('should not trigger when playing an artifact', function () {
            this.player1.play(this.fetchdrones);
            expect(this.player1.amber).toBe(0);
        });

        it('should not trigger when discarding an artifact', function () {
            this.player1.clickCard(this.fetchdrones);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1.amber).toBe(0);
        });

        it('should not trigger when using a creature to reap', function () {
            this.player1.reap(this.archimedes);
            expect(this.player1.amber).toBe(1);
        });

        it('should not trigger when using a creature to fight', function () {
            this.player1.fightWith(this.archimedes, this.lamindra);
            expect(this.player1.amber).toBe(0);
        });

        it('should not trigger when using a creature action', function () {
            this.player1.useAction(this.timetraveller);
            expect(this.player1.amber).toBe(0);
        });
    });
});
