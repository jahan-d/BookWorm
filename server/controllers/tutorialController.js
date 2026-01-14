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

    async addTutorial(req, res) {
        try {
            const tutorialData = req.body;
            const result = await this.Tutorial.create(tutorialData);
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error adding tutorial', error: error.message });
        }
    }

    async deleteTutorial(req, res) {
        try {
            const id = req.params.id;
            const result = await this.Tutorial.delete(id);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error deleting tutorial', error: error.message });
        }
    }
}

module.exports = TutorialController;
