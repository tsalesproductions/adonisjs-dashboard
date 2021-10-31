import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import QrData from 'App/Models/QrCode';
import Database from '@ioc:Adonis/Lucid/Database';

export default class DashboardController {
  private async searchInDatabase(query, data){
    return await Database.rawQuery(query, data);
  }

  public async showIndex({ view, auth, response }: HttpContextContract) {
    await auth.use('web').authenticate();

    const userData = await User.findBy('email', auth.user?.email);

    if (!userData) {
        await auth.logout();
        return response.redirect('/login');
    }
    
    const name = userData.name;

    return view.render('dashboard/home', {
      user: userData,
      name
    });
  }
}
