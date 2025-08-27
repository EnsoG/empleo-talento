import React, { useState, useEffect } from 'react';

interface ExternalJob {
    id: string;
    internal_id: number;
    external_id?: string;
    title: string;
    location: string;
    region: string;
    description: string;
    requirements: string;
    publication_date?: string;
    created_at?: string;
    updated_at?: string;
    external_url?: string;
    source: string;
    source_type: 'external' | 'internal';
    is_active: boolean;
    can_apply_external: boolean;
    company_name: string;
    scraping_info?: {
        scraped_at: string;
        original_source: string;
    };
}

interface ExternalJobsData {
    detail: string;
    total_count: number;
    codelco_count: number;
    internal_count: number;
    source_filter: string;
    jobs: ExternalJob[];
    sources_available: {
        codelco: {
            name: string;
            description: string;
            count: number;
            can_apply_external: boolean;
        };
        internal: {
            name: string;
            description: string;
            count: number;
            can_apply_external: boolean;
        };
    };
}

export const EmpleosExternos: React.FC = () => {
    const [jobs, setJobs] = useState<ExternalJob[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sourceFilter, setSourceFilter] = useState<string>('all');
    const [data, setData] = useState<ExternalJobsData | null>(null);
    const [selectedJob, setSelectedJob] = useState<ExternalJob | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchExternalJobs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/v1/admin/external-jobs?source=${sourceFilter}&limit=50`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const responseData: ExternalJobsData = await response.json();
            setData(responseData);
            setJobs(responseData.jobs);
            
        } catch (error) {
            console.error('Error obteniendo empleos externos:', error);
            // toast.error('❌ Error al obtener empleos externos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSourceFilterChange = (newSource: string) => {
        setSourceFilter(newSource);
    };

    const openJobModal = (job: ExternalJob) => {
        setSelectedJob(job);
        setShowModal(true);
    };

    const closeJobModal = () => {
        setSelectedJob(null);
        setShowModal(false);
    };

    const getSourceBadge = (job: ExternalJob) => {
        if (job.source_type === 'external') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🌐 {job.source}
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    🏢 {job.source}
                </span>
            );
        }
    };

    useEffect(() => {
        fetchExternalJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceFilter]);

    return (
        <div className="empleos-externos bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    🌍 Empleos Externos
                </h2>
                <p className="text-gray-600">
                    Gestión y visualización de empleos de fuentes externas e internas
                </p>
            </div>

            {/* Estadísticas y Filtros */}
            {data && (
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{data.total_count}</div>
                            <div className="text-blue-800 text-sm">Total Empleos</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">{data.codelco_count}</div>
                            <div className="text-purple-800 text-sm">Empleos Externos</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">{data.internal_count}</div>
                            <div className="text-green-800 text-sm">Empleos Internos</div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleSourceFilterChange('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                sourceFilter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Todos ({data.total_count})
                        </button>
                        <button
                            onClick={() => handleSourceFilterChange('codelco')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                sourceFilter === 'codelco'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Externos ({data.codelco_count})
                        </button>
                        <button
                            onClick={() => handleSourceFilterChange('internal')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                sourceFilter === 'internal'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Internos ({data.internal_count})
                        </button>
                        <button
                            onClick={fetchExternalJobs}
                            className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            🔄 Actualizar
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de Empleos */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                        <p className="mt-2 text-gray-600">Cargando empleos...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No hay empleos disponibles</p>
                        <p className="text-sm text-gray-500 mt-1">Intenta con un filtro diferente</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                        {getSourceBadge(job)}
                                        {job.can_apply_external && (
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                                Aplicación Externa
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>🏢 <strong>Empresa:</strong> {job.company_name}</p>
                                        <p>📍 <strong>Ubicación:</strong> {job.location} • {job.region}</p>
                                        {job.publication_date && (
                                            <p>📅 <strong>Publicado:</strong> {new Date(job.publication_date).toLocaleDateString('es-CL')}</p>
                                        )}
                                        {job.scraping_info && (
                                            <p>🕒 <strong>Scrapeado:</strong> {new Date(job.scraping_info.scraped_at).toLocaleString('es-CL')}</p>
                                        )}
                                        {job.external_id && (
                                            <p>🔗 <strong>ID Externo:</strong> {job.external_id}</p>
                                        )}
                                    </div>

                                    {/* Descripción truncada */}
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-700 line-clamp-2">
                                            {job.description.length > 150 
                                                ? `${job.description.substring(0, 150)}...` 
                                                : job.description
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="ml-4 flex flex-col gap-2">
                                    <button
                                        onClick={() => openJobModal(job)}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        Ver Detalles
                                    </button>
                                    
                                    {job.external_url && (
                                        <a
                                            href={job.external_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm text-center"
                                        >
                                            Aplicar ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Detalles */}
            {showModal && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                                    <p className="text-gray-600">{selectedJob.company_name}</p>
                                </div>
                                <button
                                    onClick={closeJobModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {getSourceBadge(selectedJob)}
                                    {selectedJob.can_apply_external && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Aplicación Externa
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <strong>📍 Ubicación:</strong> {selectedJob.location}
                                    </div>
                                    <div>
                                        <strong>🌎 Región:</strong> {selectedJob.region}
                                    </div>
                                    {selectedJob.publication_date && (
                                        <div>
                                            <strong>📅 Publicado:</strong> {new Date(selectedJob.publication_date).toLocaleDateString('es-CL')}
                                        </div>
                                    )}
                                    {selectedJob.external_id && (
                                        <div>
                                            <strong>🔗 ID Externo:</strong> {selectedJob.external_id}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">📝 Descripción</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">📋 Requisitos</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.requirements}</p>
                                </div>

                                {selectedJob.scraping_info && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <h4 className="font-medium text-blue-900 mb-1">ℹ️ Información de Scraping</h4>
                                        <p className="text-blue-700 text-sm">
                                            <strong>Scrapeado:</strong> {new Date(selectedJob.scraping_info.scraped_at).toLocaleString('es-CL')}
                                        </p>
                                        <p className="text-blue-700 text-sm">
                                            <strong>Fuente:</strong> {selectedJob.scraping_info.original_source}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                    {selectedJob.external_url && (
                                        <a
                                            href={selectedJob.external_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Aplicar en Sitio Original ↗
                                        </a>
                                    )}
                                    <button
                                        onClick={closeJobModal}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Información */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">ℹ️ Información sobre Empleos Externos</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Empleos Externos:</strong> Provienen de sitios como Codelco via scraping automático</li>
                    <li>• <strong>Empleos Internos:</strong> Creados directamente en el portal por empresas</li>
                    <li>• <strong>Aplicación Externa:</strong> Redirige al sitio original para postular</li>
                    <li>• <strong>Todos los empleos</strong> aparecen también en el listado público del portal</li>
                </ul>
            </div>
        </div>
    );
};

export default EmpleosExternos;
