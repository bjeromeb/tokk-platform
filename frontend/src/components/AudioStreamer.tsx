import React, { useEffect, useState } from 'react'; //useRef } from 'react';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import ReactPlayer from 'react-player';
import './AudioStreamer.css'; // Make sure to create a corresponding CSS file

interface AudioStreamerProps {
  objectKey: string;
}

const AUDIO_FILE_BUCKET = process.env.LARGE_MESSAGE_BUCKET;
const REGION = process.env.VITE_APP_REGION;

const AudioStreamer: React.FC<AudioStreamerProps> = ({ objectKey }) => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [playing, setPlaying] = useState<boolean>(false);
//   const playerRef = useRef<ReactPlayer>(null);
  const bucketName = AUDIO_FILE_BUCKET;
  const region = REGION;

  useEffect(() => {
    const fetchAudioUrl = async () => {
      const s3Client = new S3Client({ region });
      const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      setAudioUrl(url);
    };

    fetchAudioUrl();
  }, [bucketName, objectKey, region]);

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  return (
    <div className="audio-streamer">
      {audioUrl ? (
        <div className="audio-player">
          <button className="play-pause-button" onClick={togglePlayPause}>
            {playing ? 'Pause' : 'Play'}
          </button>
          {/* <ReactPlayer
            ref={playerRef}
            url={audioUrl}
            playing={playing}
            controls={false}
            width="0"
            height="0"
            style={{ display: 'none' }} // Hide the ReactPlayer element
          /> */}
        </div>
      ) : (
        <p></p>
        // <p>Loading...</p> 
      )}
    </div>
  );
};


export default AudioStreamer;
