// @ts-nocheck
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './sanity/schema';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '981jghg0';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const siteUrl = 'http://localhost:3000';

export default defineConfig({
  name: 'gudstor-pack-studio',
  title: 'GUDSTOR PACK CMS',
  projectId,
  dataset,
  basePath: '/admin',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido del Sitio')
          .items([
            S.listItem()
              .title('Configuración del Sitio')
              .icon(() => '⚙️')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem().title('Hero Slides').schemaType('heroSlide').child(S.documentTypeList('heroSlide').title('Slides del Hero')),
            S.listItem().title('Estadísticas').schemaType('stat').child(S.documentTypeList('stat').title('Estadísticas')),
            S.listItem().title('Testimonios').schemaType('testimonial').child(S.documentTypeList('testimonial').title('Testimonios')),
            S.listItem().title('Socios / Clientes').schemaType('partner').child(S.documentTypeList('partner').title('Socios / Clientes')),
            S.listItem().title('Secciones Home').schemaType('homeSection').child(S.documentTypeList('homeSection').title('Secciones del Home')),
            S.divider(),
            S.listItem().title('Productos').schemaType('product').child(S.documentTypeList('product').title('Productos')),
            S.divider(),
            S.listItem().title('Servicios').schemaType('service').child(S.documentTypeList('service').title('Servicios')),
            S.listItem().title('Categorías de Servicio').schemaType('serviceCategory').child(S.documentTypeList('serviceCategory').title('Categorías')),
            S.divider(),
            S.listItem().title('Casos de Éxito').schemaType('project').child(S.documentTypeList('project').title('Casos de Éxito')),
            S.listItem().title('Equipo').schemaType('teamMember').child(S.documentTypeList('teamMember').title('Miembros del Equipo')),
          ]),
    }),
    visionTool(),
    presentationTool({
      name: 'presentation',
      title: 'Presentation',
      previewUrl: {
        origin: siteUrl,
        draftMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      // Esto desbloquea el nuevo iframe security check introducido en Sanity v3
      allowOrigins: ['http://localhost:3000', 'https://gudstor-pack.vercel.app']
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});