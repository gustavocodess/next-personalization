import { createAdminApiClient } from '@builder.io/admin-sdk';
import { getAttributes } from '@builder.io/personalization-context-menu'
import { NextApiRequest, NextApiResponse } from 'next'

if (!process.env.BUILDER_PRIVATE_KEY) {
  throw new Error('No BUILDER_PRIVATE_KEY defined')
}

/**
 * API to get the custom targeting attributes from Builder, only needed for the context menu to show a configurator and allow toggling of attributes
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {

  // TODO: admin sdk not working for issues with dependencies
  // TODO: in future rollback to getAttributes call
  // const attributes = await getAttributes(process.env.BUILDER_PRIVATE_KEY!)
  // console.log('ATTRIBUTES AQUI ', attributes)


  const result = await fetch('https://builder.io/api/v2/admin', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.BUILDER_PRIVATE_KEY,
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"operationName":null,"variables":{},"query":"{\n  settings\n  id\n  models {\n    id\n    name\n  }\n}\n"}),
    }).then((data) => data.json())

  const segmentData = result.data?.settings.customTargetingAttributes?.segment
  // const segments = await fetch('https://api.jsonbin.io/v3/c/63951248c5b3a64f1bc89744/bins', {
  //   headers: {
  //     'X-Master-Key': '$2b$10$KWGGLHhJp15xq4gaGSn54umvhBsv5k.pk8udr8jDZoEBKOuP0NQh2',
  //     'Content-Type': 'application/json',
  //   }}).then((data) => data.json())
  const segments = await fetch('https://builderdemo-e6db.restdb.io/rest/segment', {
    headers: {
      'x-api-key': '6395717bf43a573dae095469',
      'Content-Type': 'application/json',
    }}).then((data) => data.json())

  segmentData.enum = segments.map((seg: any) => seg.name)

  const userData = result.data?.settings.customTargetingAttributes?.user
  // const users = await fetch('https://api.jsonbin.io/v3/c/63954a5a962da34f538cc369/bins', {
  //     headers: {
  //       'X-Master-Key': '$2b$10$KWGGLHhJp15xq4gaGSn54umvhBsv5k.pk8udr8jDZoEBKOuP0NQh2',
  //       'Content-Type': 'application/json',
  //     }}).then((data) => data.json())

  const users = await fetch('https://builderdemo-e6db.restdb.io/rest/susers', {
    headers: {
      'x-api-key': '6395717bf43a573dae095469',
      'Content-Type': 'application/json',
    }}).then((data) => data.json())
  
  userData.enum = users.map((user: any) => user.fullName)

  const newAtt = {
    ...result.data?.settings.customTargetingAttributes,
    segment: segmentData,
    segment1: segmentData,
    user: userData,
  }

  // console.log('ATTRIBUTES ', newAtt)
  res.send(newAtt)
}
