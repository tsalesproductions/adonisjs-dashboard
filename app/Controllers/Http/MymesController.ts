import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QrData from 'App/Models/QrCode';
import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database'

export default class MymesController {
  public async mymeManager({view, request, response, params }: HttpContextContract) {
    let body = params;

    let data = await QrData.findBy('qr_id', body.id);

    return view.render('myme/index', {
      data: data, 
      qr_id: body.id,
      meu_emergencia: (data?.qr_emergencia ? JSON.parse(data?.qr_emergencia) : []),
      meus: (data?.qr_meus ? JSON.parse(data?.qr_meus) : []),
    });
  }

  private async uploadFile(request, name){
    const file = request.file(name);
    const fileName = `myme_${Math.floor(Math.random() * 99999999) + 1}.${file.extname}`
    await file.move(Application.publicPath('uploads'), {
      name: fileName,
    });

    return `/uploads/${fileName}`;
  }

  public async mymeSend({view, request, response }: HttpContextContract) {
    const { 
      field_eu_nome,
      field_eu_nascimento,
      field_eu_email,
      field_eu_escola,
      field_eu_serie,
      field_eu_endereco,
      field_eu_numero,
      field_eu_cidade,
      field_eu_doenca,
      field_eu_medicamento,
      field_eu_peso,
      field_eu_alergia,
      field_eu_sangue,
      field_sus_numero,
      field_plano_nome,
      field_plano_numero,
      field_meu_obs,
      field_eu_e_nome1,
      field_eu_e_contato1,
      field_eu_e_nome2,
      field_eu_e_contato2,
      qr_meus,
      qr_id,
      qr_password
    } = request.all();

    const {eu, meus} = JSON.parse(qr_meus);

    let data = await QrData.findBy('qr_id', qr_id);

    let emergencia = [
      {
        nome: field_eu_e_nome1,
        contato: field_eu_e_contato1,
      },
      {
        nome: field_eu_e_nome2,
        contato: field_eu_e_contato2,
      }
    ]

    let result = await Database.rawQuery(
      `UPDATE qr_codes SET
      qr_imagem = ?,
      qr_cliente_nome = ?,
      qr_cliente_nascimento = ?,
      qr_cliente_email = ?,
      qr_cliente_anexo = ?,
      qr_cliente_escola_nome = ?,
      qr_cliente_escola_serie = ?,
      qr_cliente_endereco_rua = ?,
      qr_cliente_endereco_numero = ?,
      qr_cliente_endereco_cidade = ?,
      qr_cliente_doenca = ?,
      qr_cliente_uso_medicamento = ?,
      qr_cliente_peso = ?,
      qr_cliente_alergia = ?,
      qr_cliente_tipo_sanguineo = ?,
      qr_cliente_sus_numero = ?,
      qr_cliente_plano_nome = ?,
      qr_cliente_plano_numero = ?,
      qr_cliente_obs = ?,
      qr_emergencia = ?,
      qr_meus = ?,
      qr_status = ?,
      qr_password = ?
      WHERE qr_id = ?
    `, [
      eu.foto,
      field_eu_nome,
      field_eu_nascimento,
      field_eu_email,
      eu.anexo,
      field_eu_escola,
      field_eu_serie,
      field_eu_endereco,
      field_eu_numero,
      field_eu_cidade,
      field_eu_doenca,
      field_eu_medicamento,
      field_eu_peso,
      field_eu_alergia,
      field_eu_sangue,
      field_sus_numero,
      field_plano_nome,
      field_plano_numero,
      field_meu_obs,
      JSON.stringify(emergencia),
      JSON.stringify(meus),
      1,
      qr_password,
      qr_id
    ]);

    return response.redirect('/myme/'+qr_id);
  }

  private async validateWithoutPassword(response, userData){
    return response.redirect('/myme/'+userData.qr_id);
  }

  public async login({ request, response, session }: HttpContextContract) {
    const { serial, password, nopass } = request.all();
    
    const userData = await QrData.findBy('qr_id', serial);
    
    if (!userData) {
      session.flash('notification', 'OPS! Serial não encontrado');
      return response.redirect('back');
    }

    if(nopass) return this.validateWithoutPassword(response, userData);
    
    if (userData.qr_password !== password) {
      session.flash('notification', 'OPS! Serial e senha não conferem');
      return response.redirect('back');
    }

    let result = await Database.rawQuery(`UPDATE qr_codes SET qr_status = ? WHERE qr_id = ? AND qr_password = ?`, ['0', serial, password]);
    
    return response.redirect('/myme/'+userData.qr_id);
  }
}

