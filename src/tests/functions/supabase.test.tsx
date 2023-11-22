import {getSupabaseBrowserClient, getSupabaseRouteHandlerClient} from "@/lib/supabase";
import {test_admin_info, test_user_info} from "../../../jest-setup";
import {describe} from "node:test";


describe("supabase auth integration testing", () => {
  // make sure auth is enabled, try accessing protected routes
  const supabase = getSupabaseBrowserClient()

  it("logging in as the default user", async () => {
    const {error, data: {session, user}} = await supabase.auth.signInWithPassword({
      email: test_user_info.email,
      password: test_user_info.password,
    })
    expect(error).toBeNull()
    expect(session).not.toBeNull()
    expect(user).not.toBeNull()
  })

  it("logging in as the admin user", async () => {
    const {error, data: {session, user}} = await supabase.auth.signInWithPassword({
      email: test_admin_info.email,
      password: test_admin_info.password,
    })
    expect(error).toBeNull()
    expect(session).not.toBeNull()
    expect(user).not.toBeNull()
  })

  // todo make backend route to change own password
  it("changing a user's password", async () => {
    const {error, data: {session, user}} = await supabase.auth.signInWithPassword({
      email: test_user_info.email,
      password: test_user_info.password,
    })

    const response = await supabase.auth.updateUser({
      password: "password change"
    })

    expect(response.error).toBeNull();
  })

  it("logging in with changed credentials", async () => {
    const {error, data: {session, user}} =
        await supabase.auth.signInWithPassword({
      email: test_user_info.email,
      password: "password change"
    })
    expect(error).toBeNull()
    expect(session).not.toBeNull()
    expect(user).not.toBeNull()
  })

  it("changing user credentials back", async () => {
    const {error, data: {session, user}} =
        await supabase.auth.signInWithPassword({
          email: test_user_info.email,
          password: "password change"
        })

    await supabase.auth.updateUser({
      password: test_user_info.password
    })
    expect(error).toBeNull()
    expect(session).not.toBeNull()
    expect(user).not.toBeNull()
  })

  it.todo("access a non protected route as a normal user");
  it.todo("access a protected route as a normal user");
  it.todo("access a non protected route as an admin");
  it.todo("access a protected route as an admin");

  it('log out', async () => {
    const {error} = await supabase.auth.signOut();
    expect(error).toBeNull()
  })
})