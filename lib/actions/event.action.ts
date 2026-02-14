'use server';

import Event from "@/models/Event";
import connectToDatabase from "../mongodb";

export const getSimilarEventBySlug = async (slug: string) => {
    try{
        await connectToDatabase();

        const event = await Event.findOne({slug});

        return await Event.find({_id:{$ne: event._id},tags:{$in:event.tags}}).lean();
    }
    catch{
        return [];
    }

}

export const getEvents = async () => {
    try{
        await connectToDatabase();

        const events = await Event.find().lean();

        return events;
    }
    catch{
        return [];
    }

}

export const getEventDetail = async (slug: string) => {
    try{
        await connectToDatabase();

        const event = await Event.findOne({slug});

        return await Event.find({_id: event._id}).lean();
    }
    catch{
        return [];
    }

}