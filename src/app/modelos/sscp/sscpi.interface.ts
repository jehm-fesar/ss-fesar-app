export interface SolicitudSCPI{
    id?: string|any;
    folio?: string|any;
    departamento_id: string|any;
    remitente: string|any;
    destinatario: string|any;
    destino: string|any;
    entrega: string|any;
    tCorrespondencia: string|any;
    formaEnvio: string|any;
    fechaSol: string|any;

    fechaSolImp?: string|any;
    
    cantidad: string|any;
    tEnvio: string|any;
    infAd: string|any;
    anexo: string|any;

    dateEntrega?: Date;
    dateFechaSol?: Date;
}