import React from 'react';
import formatShortDate from '../functions/formatDate';
const Reply = ({ reply, handleReply,commentId }) => {

  return (
    <div className="reply" style={{ textAlign: 'right' }}>
      <div className="comm" style={{ marginBottom: '4px', marginTop: '10px' }}>
        <img
          src={`http://localhost:5000/images/${reply.postedBy.profileImage}`}
          style={{ width: '37px', height: '37px', borderRadius: '100px', objectFit: 'cover' }}
          alt="User"
        />
        <div style={{ lineHeight: '4px', display: 'flex', flexDirection: 'column' }}>
          <span className="commenter" style={{ fontWeight: 'bold', fontSize: '14px', display: 'flex', gap: '3px' }}>
            {reply.postedBy.name}
            <p style={{ fontSize: '11px', color: '#403131bf' }}>
              {formatShortDate(reply.createdAt)}
            </p>
          </span>
          <span style={{ display: 'flex', gap: '4px', fontSize: '14px' }}>
            <p className="comment-text"> {reply.reply}</p>
            <button
              style={{ fontSize: '12px', color: 'blue', marginTop: '-17px' }}
              className="btn btn-primary-sm"
              onClick={() => handleReply(reply,commentId)}
            >
              Reply
            </button>
          </span>
        </div>
      </div>
      {reply.replies && reply.replies.map(subReply => (
        <Reply key={subReply._id} reply={subReply} handleReply={handleReply} commentId={commentId} />
      ))}
    </div>
  );
};

export default Reply;
