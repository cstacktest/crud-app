const request = require("supertest");
const expect = require("expect");
const { ObjectID } = require("mongodb");

const { app } = require("./../server.js");
const { tweets } = require("./../models/tweets.js");
const { addTweets, newTweets } = require("./seed/seed.js");

beforeEach(addTweets);

describe("post/ tweets", () => {

    it("should create a new tweet", (done) => {
        var text = "test tweet text";
        var user = "user1";
        request(app)
            .post("/api/tweets")
            .send({ text, user })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) return done(err);

                tweets.find({ "_id": res.body._id }).then((result) => {
                    expect(result[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                })
            })
    })

    it("should fail for invalid object", (done) => {

        request(app)
            .post("/api/tweets")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                tweets.find({}).then((result) => {
                    done();
                }).catch((err) => {
                    done(err);
                })
            })
    })
})


describe("get/ tweets", () => {
    it("should return all tweets", (done) => {

        request(app)
            .get("/api/tweets")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                tweets.find({}).then((result) => {
                    expect(result.length).toBeGreaterThan(0);
                    done();
                }).catch((err) => {
                    done(err);
                })
            })
    })

    it("should return tweets for the specified objectid", (done) => {

        request(app)
            .get(`/api/tweets/${newTweets[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(newTweets[0].text)
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            })
    });

    it("should return 404 invalid id", (done) => {

        request(app)
            .get(`/api/tweets/${new ObjectID()}`)
            .expect(404)
            .end(done)
    });

    it("should return 400 bad request if id not found", (done) => {

        request(app)
            .get("/api/tweets/5ad3a2642114e")
            .expect(400)
            .end(done)
    });
})


describe("DELETE/ tweets", () => {
    it("should delete a tweets", (done) => {

        var hexid = newTweets[0]._id.toHexString();
        request(app)
            .delete(`/api/tweets/${hexid}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                tweets.count({ _id: hexid }, (err, count) => {
                    expect(count).toBe(0);
                    done();
                });
            })
    })

    it("should return 404", (done) => {

        request(app)
            .delete(`/api/tweets/6adad8131daa2228549246ff`)
            .expect(404)
            .end(done);

    })


    it("should return 400 for invalid request", (done) => {

        request(app)
            .delete(`/api/tweets/5adad81`)
            .expect(400)
            .end(done);

    })

})

describe("PUT/ tweets", () => {
    it("should update a tweets", (done) => {

        var updateText = "this is updated tweet";
        var hexid = newTweets[0]._id.toHexString();
        request(app)
            .put(`/api/tweets/${hexid}`)
            .send({
                text: updateText,
                completed: false
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                tweets.findById(hexid, (err, doc) => {
                    expect(doc.text).toBe(updateText);
                    done();
                });
            })
    })

    it("should return 404", (done) => {

        request(app)
            .put(`/api/tweets/6adad8131daa2228549246ff`)
            .expect(404)
            .end(done);

    })


    it("should return 400 for invalid request", (done) => {

        request(app)
            .put(`/api/tweets/5adad81`)
            .expect(400)
            .end(done);

    })

})
