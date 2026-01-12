class TutorialController {
    constructor(models) {
        this.Tutorial = models.Tutorial;
    }

    async getTutorials(req, res) {
        try {
            const tutorials = await this.Tutorial.getAll();
            res.send(tutorials);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching tutorials', error: error.message });
        }
    }
}

module.exports = TutorialController;
