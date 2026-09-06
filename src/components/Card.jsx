import theme from "../theme";

function Card({
     children,
      title,
     padding = '24px' 
}){
      return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px', //rounded corners
        padding: padding,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
        {/*only render if title was actually passed*/}
              {title && (
        <h3
          style={{
            color: theme.colors.textPrimary,
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '16px',
            marginTop: 0,
          }}
        >
          {title}
        </h3>
      )}
            {children}
    </div>
  );
}

export default Card;
  