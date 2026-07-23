// components/LogCard.jsx
import { logFieldsConfig } from '../../config/logFieldsConfig';

const LogCard = ({ item, entidadeTipo }) => {
    const config = logFieldsConfig[entidadeTipo];
    const alteracao = item.valor.update.alteracao;

    const renderFields = (data) => (
        <>
            {config.fields.map((field) => (
                <p className="log-field" key={field.key}>
                    <strong>{field.label}:</strong> {data[field.key]}
                </p>
            ))}
        </>
    );

    const badgeMap = {
        Update: { className: 'log-badge--update', label: 'Atualização' },
        Delete: { className: 'log-badge--delete', label: 'Exclusão' },
        Create: { className: 'log-badge--create', label: 'Criação' },
    };

    const actionLabelMap = {
        Update: 'Alterado por',
        Delete: 'Excluído por',
        Create: 'Criado por',
    };

    if (!badgeMap[alteracao]) return null;

    return (
        <div className={`log-card log-card--${alteracao.toLowerCase()}`}>
            <div className="log-header">
                <span className={`log-badge ${badgeMap[alteracao].className}`}>
                    {badgeMap[alteracao].label}
                </span>
                <span className="log-date">{item.date}</span>
            </div>

            {alteracao === 'Update' ? (
                <div className="log-diff">
                    <div className="log-diff__before">
                        <span className="log-diff__label">Antes</span>
                        {renderFields(item.valor.antes)}
                    </div>
                    <div className="log-diff__arrow">→</div>
                    <div className="log-diff__after">
                        <span className="log-diff__label">Depois</span>
                        {renderFields(item.valor.depois)}
                    </div>
                </div>
            ) : (
                <div className="log-content">
                    {renderFields(item.valor[alteracao.toLowerCase()])}
                </div>
            )}

            <div className="log-footer">
                <span className="log-user">
                    <span className="log-user__avatar">{item.valor.user.user.charAt(0)}</span>
                    {actionLabelMap[alteracao]} <strong>{item.valor.user.user}</strong>
                    <span className="log-user__id">(ID #{item.valor.user.userid})</span>
                </span>
            </div>
        </div>
    );
};

export default LogCard;