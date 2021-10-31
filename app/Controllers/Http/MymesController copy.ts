import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import QrData from 'App/Models/QrCode';
import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database'

export default class MymesController {
  public async mymeManager({view, request, response, params }: HttpContextContract) {
    let body = params;

    let data = await QrData.findBy('qr_id', body.id);
    // console.log(body.id);

    let qr_emergencia,
        qr_meu_emergencia;

        if(data?.qr_emergencia){
          qr_emergencia = JSON.parse(data.qr_emergencia);
        }

        if(data?.qr_meu_emergencia){
          qr_meu_emergencia = JSON.parse(data.qr_meu_emergencia);
        }


    return view.render('myme/index', {data: data, qr_id: body.id, emergencia: {eu: qr_emergencia, meu: qr_meu_emergencia}});
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
      field_eu_endereco,
      field_eu_numero,
      field_eu_cidade,
      field_eu_sangue,
      field_eu_alergia,
      field_eu_peso,
      field_eu_medicamento,
      field_eu_email,
      field_eu_e_nome1,
      field_eu_e_contato1,
      field_eu_e_nome2,
      field_eu_e_contato2,
      field_meu_nome,
      field_meu_dataano,
      field_meu_endereco,
      field_meu_numero,
      field_meu_cidade,
      field_meu_obs,
      field_meu_c_nome1,
      field_meu_c_contato1,
      field_meu_c_nome2,
      field_meu_c_contato2,
      field_eu_foto,
      field_meu_foto,
      qr_id,
      qr_password
    }
      = request.all();

    let qr_meu_emergencia = {
      nome1: field_meu_c_nome1,
      contato1: field_meu_c_contato1,
      nome2: field_meu_c_nome2,
      contato2: field_meu_c_contato2
    }

    let qr_emergencia = {
      nome1: field_eu_e_nome1,
      contato1: field_eu_e_contato1,
      nome2: field_eu_e_nome2,
      contato2: field_eu_e_contato2
    }

    let data = await QrData.findBy('qr_id', qr_id);

    let me_img;
    let my_img;

    if(data?.qr_imagem){
      me_img = data?.qr_imagem;
    }else{
      me_img = await this.uploadFile(request, 'field_eu_foto')
    }

    if(data?.qr_imagem){
      my_img = data?.qr_meu_foto;
    }else{
      my_img = await this.uploadFile(request, 'field_meu_foto');
    }
    
    let result = await Database.rawQuery(`UPDATE qr_codes SET
    qr_imagem = ?,
    qr_cliente_nome = ?,
    qr_cliente_nascimento = ?,
    qr_cliente_endereco_rua = ?,
    qr_cliente_endereco_numero = ?,
    qr_cliente_endereco_cidade = ?,
    qr_cliente_tipo_sanguineo = ?,
    qr_cliente_alergia = ?,
    qr_cliente_peso = ?,
    qr_cliente_uso_medicamento = ?,
    qr_cliente_email = ?,
    qr_emergencia = ?,
    qr_meu_nome = ?,
    qr_meu_data = ?,
    qr_meu_endereco = ?,
    qr_meu_numero = ?,
    qr_meu_cidade = ?,
    qr_meu_obs = ?,
    qr_meu_emergencia = ?,
    qr_meu_foto = ?,
    qr_status = ? ,
    qr_password = ?
    WHERE qr_id = ?
    `, [
      me_img,
      field_eu_nome,
      field_eu_nascimento,
      field_eu_endereco,
      field_eu_numero,
      field_eu_cidade,
      field_eu_sangue,
      field_eu_alergia,
      field_eu_peso,
      field_eu_medicamento,
      field_eu_email,
      JSON.stringify(qr_meu_emergencia),
      field_meu_nome,
      field_meu_dataano,
      field_meu_endereco,
      field_meu_numero,
      field_meu_cidade,
      field_meu_obs,
      JSON.stringify(qr_emergencia),
      my_img,
      '1',
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

