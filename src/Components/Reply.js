import React from 'react';
import formatShortDate from '../functions/formatDate';

const Reply = ({ reply, handleReply, commentId, isLastReply }) => {
  return (
    <div className="reply" style={{ textAlign: 'right' }}>
      <div className="comm" style={{ marginBottom: '4px', marginTop: '10px', marginLeft: '40px' }}>
        <img
          src={`${process.env.REACT_APP_API_BASE_URL}/images/${reply.postedBy.profileImage}`}
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
            <p className="comment-text">{reply.reply}</p>
            {!isLastReply && (
              <button
                style={{ fontSize: '12px', color: 'blue', marginTop: '-17px' }}
                className="btn btn-primary-sm"
                onClick={() => handleReply(reply, commentId)}
              >
                Reply
              </button>
            )}
          </span>
        </div>
      </div>
      {reply.replies &&
        reply.replies.map((subReply, index) => (
          <Reply
            key={subReply._id}
            reply={subReply}
            handleReply={handleReply}
            commentId={commentId}
            isLastReply={index === reply.replies.length - 1}
          />
        ))}
    </div>
  );
};

export default Reply;
