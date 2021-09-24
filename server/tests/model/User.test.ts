import User from "../../src/models/User"

test("User - find user", async () => {
    const username = "karol"
    const user = await new User().find({username})
    expect(user.username).toEqual(username)
})