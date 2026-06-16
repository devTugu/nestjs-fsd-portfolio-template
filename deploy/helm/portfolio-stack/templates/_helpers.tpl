{{- define "portfolio-stack.fullname" -}}
{{- printf "%s-portfolio" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "portfolio-stack.serviceAccountName" -}}
{{- printf "%s-sa" (include "portfolio-stack.fullname" .) -}}
{{- end -}}
