import {getSupabaseBrowserClient, getSupabaseRouteHandlerClient} from "@/lib/supabase";
import {test_admin_info, test_user_info} from "../../../jest-setup";


describe("supabase auth integration testing", () => {
  // make sure auth is enabled, try accessing protected routes


  it("logging in as the default user", async () => {
    const supabase = getSupabaseBrowserClient()
    const {error, data: {session, user}} = await supabase.auth.signInWithPassword({
      email: test_user_info.email,
      password: test_user_info.password,
    })
    expect(error).toBeNull()
    expect(session).not.toBeNull()
    expect(user).not.toBeNull()
  })

  it("logging in as the admin user", async () => {
    const supabase = getSupabaseBrowserClient()
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
  })

  // try and access admin protected routes
  // password reset test

  it("logging in with changed credentials (unfinished)", async () => {
    const supabase = getSupabaseBrowserClient()
    const {error, data: {session, user}} =
        await supabase.auth.signInWithPassword({
      email: test_user_info.email,
      password: test_user_info.password
    })
    expect(error).toBeNull()
    expect(session).not.toBeNull()
    expect(user).not.toBeNull()
  })

  it('log out', async () => {
    const supabase = getSupabaseBrowserClient()
    const {error} = await supabase.auth.signOut();
    expect(error).toBeNull()
  })
})