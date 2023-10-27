// pages/api/episodes.js

import dbConnect from '@/components/lib/db';
import Episode from '@/models/Episode';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { title, description, imageLink, dateAired } = req.body;

    try {
      const newEpisode = new Episode({
        title,
        description,
        imageLink,
        dateAired: new Date(dateAired),
      });
      console.log(newEpisode);

      await newEpisode.save();
      res.status(201).json({ message: 'Episode added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
