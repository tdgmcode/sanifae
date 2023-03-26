/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
  if (cookies.get('token',{
    path: '/'
  })) 
    cookies.set(
      'token',
      '', {
        path: '/'
      }
    )

    return new Response(null, {
      status: 302,
      headers: new Headers({ Location: '/'})
   })
    
}