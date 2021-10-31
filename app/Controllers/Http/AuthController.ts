import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import Env from '@ioc:Adonis/Core/Env';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class AuthController {
  public async showLogin({ view, auth, response }: HttpContextContract) {
    await auth.use('web').check();

    if (auth.use('web').isLoggedIn) {
      return response.redirect('/dashboard');
    }else{
      return view.render('auth/login')
    }
  }

  public showRegister({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  public async register({ request, auth, response }) {
    //Validar o formulário
    const validatorSchema = await request.validate({
        schema: schema.create({
            name: schema.string({}, [rules.minLength(4), rules.maxLength(255)]),
            email: schema.string({}, [
                rules.email(),
                rules.minLength(4),
                rules.maxLength(255),
                rules.unique({ table: 'users', column: 'email' }),
            ]),
            password: schema.string({}),
        }),
        messages: {
            required: 'Esses campos são obrigatórios!',
            'email.unique': 'E-mail não pode ser utilizado!',
            minLength: 'Esses campos são obrigatórios!',
        },
    });

    const user = await User.create(validatorSchema);
    return response.redirect('/login');
  }

  public async login({ request, response, auth, session }: HttpContextContract) {
    const { email, password } = request.all();

    const userData = await User.findBy('email', email);

    if (!userData) {
        session.flash('notification', 'OPS! Essa conta não está cadastrada!');
        return response.redirect('back');
    }


    try {
        await auth.use('web').attempt(email, password);
        return response.redirect('/dashboard');
    } catch (error) {
      console.log(error)
        session.flash('notification', 'OPS! Informações de login estão incorretas!');
        return response.redirect('back');
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
      await auth.logout();
      return response.redirect('/login');
  }
}
